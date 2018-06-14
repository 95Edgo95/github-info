(function (window) {
    window.RepoRowTemplate = ({name, url}) => (
        `<div class="repo-row">
            <p class="repo-name">${name}</p>
            <a class="repo-url" href="${url}" target="_blank">
                ${url}
            </a>
        </div>`
    );
}(window));