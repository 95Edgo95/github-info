(function (window) {
    window.UserBlockTemplate = user => (
        `<div class="user-block" data-username="${user.login}" onclick="window.usersPage.navigateToUserDetails(this)">
            <img class="user-avatar" src="${user.avatar_url}">
            <p class="username">${user.login}</p>
        </div>`
    );
}(window));