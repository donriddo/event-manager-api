$(() => {
    window.currentPictureId = '';
    window.currentCommentId = '';
    window.currentThreadUrl = '';

    $('#commentButton').click((evt) => {
        evt.preventDefault();
        const text = $('#commentText').val();
        if (!text) {
            alert('Please enter some text');
            return false;
        }
        $.ajax({
            url: currentThreadUrl,
            type: 'POST',
            data: { text: text, picture: currentPictureId, comment: currentCommentId },
            beforeSend: function (xhr) {
                const userToken = localStorage.getItem('userToken');
                xhr.setRequestHeader('Authorization', "Bearer" + " " + userToken);
            }
        })
        .done((data) => {
            console.log({data});
            $('#commentText').val('');
            currentThreadUrl.includes('reply') ? setCommentThread(currentCommentId) : setPictureThread(currentPictureId);
        })
        .fail((err) => {
            console.log({err});
        });
    });

    $('#uploadButton').click((evt) => {
        evt.preventDefault();
        var fileInput = $('#image');
        console.log({fileInput: fileInput[0].files})
        var file = fileInput[0].files[0];
        if (!file) {
            alert('Please upload an image');
            return false;
        }
        var formData = new FormData();
        formData.append('image', file);
        $.ajax({
            url: 'http://localhost:37337/api/picture',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                const userToken = localStorage.getItem('userToken');
                xhr.setRequestHeader('Authorization', "Bearer" + " " + userToken);
            }
        })
        .done((data) => {
            console.log({data});
        })
        .fail((err) => {
            console.log({err});
        });
    });

    window.setPictureThread = async (id) => {
        currentPictureId = id;
        currentThreadUrl = 'http://localhost:37337/api/picture/comment/';
        let loggedInUser = localStorage.getItem('userObject');
        if (loggedInUser) loggedInUser = JSON.parse(loggedInUser);
        let picture = await $.ajax({
            url: `http://localhost:37337/api/picture/${currentPictureId}`,
            beforeSend: function (xhr) {
                const userToken = localStorage.getItem('userToken');
                xhr.setRequestHeader('Authorization', "Bearer" + " " + userToken);
            }
        });
        $('#threadDisplay').empty();
        picture.comments.forEach(async comment => {
            console.log(comment)
            const user = await $.ajax({
                url: `http://localhost:37337/api/user/${comment.user}`,
                beforeSend: function (xhr) {
                    const userToken = localStorage.getItem('userToken');
                    xhr.setRequestHeader('Authorization', "Bearer" + " " + userToken);
                }
            });
            let commentHtml = `
                <div class="picturePost">
                    <div class="picTitle">${user.email}</div>
                    <p>${comment.text}</p>
                    <div class="picTitle">${comment.replies.length} replies</div>
                    <button onclick="setCommentThread(\'${comment._id}\')" class="photobutton">Reply or View Replies</button>
            `;
            if (loggedInUser._id === comment.user) {
                commentHtml += `
                    <button onclick="deleteComment(\'${comment._id}\', 'picture')" class="photobutton" style="background-color:red;color:white;">Delete Comment</button>
                </div>
                `;
            } else {
                commentHtml += '</div>';
            }
            $('#threadDisplay').append(commentHtml);
        });
        $('#threadPane').show();
    }

    window.setCommentThread = async (id) => {
        currentCommentId = id;
        currentThreadUrl = 'http://localhost:37337/api/comment/reply';
        let loggedInUser = localStorage.getItem('userObject');
        if (loggedInUser) loggedInUser = JSON.parse(loggedInUser);
        let comment = await $.ajax({
            url: `http://localhost:37337/api/comment/${currentCommentId}`,
            beforeSend: function (xhr) {
                const userToken = localStorage.getItem('userToken');
                xhr.setRequestHeader('Authorization', "Bearer" + " " + userToken);
            }
        });
        $('#threadDisplay').empty();
        console.log({comment})
        comment.replies.forEach(async reply => {
            console.log(reply)
            const user = await $.ajax({
                url: `http://localhost:37337/api/user/${reply.user}`,
                beforeSend: function (xhr) {
                    const userToken = localStorage.getItem('userToken');
                    xhr.setRequestHeader('Authorization', "Bearer" + " " + userToken);
                }
            });
            let replyHtml = `
                <div class="picturePost">
                    <div class="picTitle">${user.email}</div>
                    <p>${reply.text}</p>
                    <div class="picTitle">${reply.replies.length} replies</div>
                    <button onclick="setCommentThread(\'${reply._id}\')" class="photobutton">Reply or view replies</button>
            `;
            if (loggedInUser._id === reply.user) {
                replyHtml += `
                    <button onclick="deleteComment(\'${comment._id}\', 'comment')" class="photobutton" style="background-color:red;color:white;">Delete Reply</button>
                </div>
                `;
            } else {
                replyHtml += '</div>';
            }
            $('#threadDisplay').append(replyHtml);
        });
        $('#threadPane').show();
    }

    function newLogin(data) {
        console.log('A new user logged in: ', data)
    }

    function fetchPictures() {
        $.get('http://localhost:37337/api/picture')
        .done((data) => {
            console.log('all pictures: ', {data});
            let user = localStorage.getItem('userObject');
            if (user) user = JSON.parse(user);
            $('#pictureDisplay').empty();
            data.forEach(picture => {
                let picHtml = `
                <div class="picturePost">
                    <div class="picTitle">${picture.user.email}</div>
                    <image class="picImage" src=${picture.url} />
                    <div class="picTitle">${picture.comments.length} comments</div>
                    <button onclick="setPictureThread(\'${picture._id}\')" class="photobutton">Comment or view comments</button>
                `;
                if (user._id === picture.user._id) {
                    picHtml += `
                        <button onclick="deletePicture(\'${picture._id}\')" class="photobutton" style="background-color:red;color:white;">Delete Picture</button>
                    </div>
                    `;
                } else {
                    picHtml += '</div>';
                }
                $('#pictureDisplay').append(picHtml);
            });
        })
        .fail((err) => {
            console.log({err})
            // $('#errorBox').html(err.responseJSON.message);
        });
    }

    window.deletePicture = (id) => {
        $.ajax({
            url: `http://localhost:37337/api/picture/${id}`,
            type: 'DELETE',
            beforeSend: function (xhr) {
                const userToken = localStorage.getItem('userToken');
                xhr.setRequestHeader('Authorization', "Bearer" + " " + userToken);
            }
        })
        .done((data) => {
            console.log({data});
            fetchPictures();
        })
        .fail((err) => {
            console.log({err});
        });
    }

    window.deleteComment = (id, toReload) => {
        $.ajax({
            url: `http://localhost:37337/api/comment/${id}`,
            type: 'DELETE',
            beforeSend: function (xhr) {
                const userToken = localStorage.getItem('userToken');
                xhr.setRequestHeader('Authorization', "Bearer" + " " + userToken);
            }
        })
        .done((data) => {
            console.log({data});
            toReload === 'picture' ? setPictureThread(currentPictureId) : setCommentThread(currentCommentId);
        })
        .fail((err) => {
            console.log({err});
        });
    }

    async function reloadPictures(picture) {
        let user = await $.ajax({
            url: `http://localhost:37337/api/user/${picture.user}`,
            beforeSend: function (xhr) {
                const userToken = localStorage.getItem('userToken');
                xhr.setRequestHeader('Authorization', "Bearer" + " " + userToken);
            }
        });
        console.log(`${user.email} just uploaded a picture`);
        alert(`${user.email} just uploaded a picture`);
        fetchPictures();
    }

    async function commentPicture(picture) {
        let loggedInUser = localStorage.getItem('userObject');
        if (loggedInUser) loggedInUser = JSON.parse(loggedInUser);
        let user = await $.ajax({
            url: `http://localhost:37337/api/user/${picture.commenter}`,
            beforeSend: function (xhr) {
                const userToken = localStorage.getItem('userToken');
                xhr.setRequestHeader('Authorization', "Bearer" + " " + userToken);
            }
        });
        console.log(`${user.email} just commented a picture`, picture.user);
        if (loggedInUser._id === picture.user._id) alert(`${user.email} just commented on your picture`);
        fetchPictures();
    }

    var socket = io();
    socket.on('newConn', console.log);
    socket.on('join', newLogin);
    socket.on('newPicture', reloadPictures);
    socket.on('newPictureComment', commentPicture);
    socket.emit('login', 'Random user');

    fetchPictures();
});