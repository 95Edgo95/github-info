(function (window, document, history, helpers, template, toolTipTemplate, paginationTemplate) {
    const paginationSize = 20;

    let paginationDetails = {
        nextDisabled: true,
        prevDisabled: true
    };
    let totalCount = 0;
    let repos = [];
    let user = {};
    let page = 1;

    if (history.state && history.state.details) {
        totalCount = history.state.details.totalCount;
        repos = history.state.details.repos;
        user = history.state.details.user;
        page = history.state.details.page;

        paginationDetails.nextDisabled = page * paginationSize > totalCount;
        paginationDetails.prevDisabled = page === 1;
    }

    function renderRepos(returnElement = false) {
        const reposTemplates = [];

        for (let i = 0; i < repos.length; i++) {
            reposTemplates.push(template(repos[i]))
        }

        if (returnElement) {
            return reposTemplates.join("\n");
        } else {
            const container = document.getElementById("repos-container");
            container.innerHTML = reposTemplates.join("\n");
        }
    }

    function updatePaginationDisabled() {
        helpers.updatePaginationDisabled(paginationDetails);
    }

    function init(passedUser) {
        user = passedUser;

        const container = document.getElementById("content");
        const reposTemplates = [];

        for (let i = 0; i < repos.length; i++) {
            reposTemplates.push(template(repos[i]))
        }

        const hint = document.getElementById("hint");
        if (hint) {
            hint.remove();
        }

        container.innerHTML = (
            `<div class="tooltip">
                <span class="icon-container back-icon" onclick="window.userPage.goBack()">
                    <i class="arrow"></i>
                    Back to Users
                </span>
            </div>
            <div class="user-data">
                <div class="user-block">
                    <img class="user-avatar" src="${user.avatar_url}">
                    <p class="username">${user.login}</p>
                </div>
                <div class="user-info">
                    <p>ID - ${user.id}</p>
                    <p>Name - ${user.name}</p>
                    <p>Company - ${user.company}</p>
                    <p>Blog - ${user.blog}</p>
                    <p>Location - ${user.location}</p>
                    <p>Followers - ${user.followers}</p>
                    <p>Following - ${user.following}</p>
                    <p>Is Admin - ${user.site_admin ? "Yes" : "No"}</p>
                </div>
            </div>
            <div class="user-repositories">
            <div class="tooltip">
                <p>User's repositories</p>
                <div class="pagination">
                    <span class="icon-container icon-left" onclick="window.userPage.paginateLeft()">
                        <i class="arrow"></i>
                        Prev
                    </span>
                    <span class="icon-container icon-right" onclick="window.userPage.paginateRight()">
                        Next
                        <i class="arrow"></i>
                    </span>
                </div>
            </div>
            <div id="repos-container">
                ${repos.length > 0 ? renderRepos(true) : ""}
            </div>
            <div class="pagination">
                <span class="icon-container icon-left" onclick="window.userPage.paginateLeft()">
                    <i class="arrow"></i>
                    Prev
                </span>
                <span class="icon-container icon-right" onclick="window.userPage.paginateRight()">
                    Next
                    <i class="arrow"></i>
                </span>
            </div>
        </div>`
        );

        if (repos.length === 0) {
            getRepos(page);
        }
    }

    function paginateRight() {
        if (!paginationDetails.nextDisabled) {
            page++;
            getRepos(page);
        }
    }

    function paginateLeft() {
        if (!paginationDetails.prevDisabled) {
            page--;
            getRepos(page);
        }
    }

    function getRepos(page) {
        window.helpers.getRepos(`@${user.login}`, page, "user")
            .then(data => {
                if (history.state && history.state.page && !history.state.page.includes(`/user/${user.id}`)) {
                    return;
                }

                paginationDetails.nextDisabled = page * paginationSize > data.total_count;
                paginationDetails.prevDisabled = page === 1;
                totalCount = data.total_count;
                repos = data.items;

                updatePaginationDisabled();

                const newState = {
                    details: {repos, totalCount, page, user},
                    page: "user-details"
                };
                const newUrl = page > 1 ? `/user/${user.id}?page=${page}` : `/user/${user.id}`;

                history.replaceState(newState, newUrl, newUrl);

                renderRepos();
            });
    }

    function goBack() {
        history.back();
    }

    function reset() {
        paginationDetails = {
            nextDisabled: true,
            prevDisabled: true
        };
        totalCount = 0;
        repos = [];
        user = {};
        page = 1;
    }

    window.userPage = {
        paginateRight,
        paginateLeft,
        goBack,
        reset,
        init
    };

}(window, document, history, helpers, RepoRowTemplate, ToolTipTemplate, PaginationTemplate));