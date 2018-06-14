(function (window, document, history, helpers, template, toolTipTemplate, paginationTemplate) {
    const paginationSize = 20;

    let paginationDetails = {
        nextDisabled: true,
        prevDisabled: true
    };
    let searchValue = "";
    let totalCount = 0;
    let users = [];
    let page = 1;

    if (history.state && history.state.details) {
        searchValue = history.state.details.searchValue;
        totalCount = history.state.details.totalCount;
        users = history.state.details.users;
        page = history.state.details.page;

        paginationDetails.nextDisabled = page * paginationSize > totalCount;
        paginationDetails.prevDisabled = page <= 1;
    }

    function renderUsers(returnElement = false) {
        const usersTemplates = [];

        for (let i = 0; i < users.length; i++) {
            usersTemplates.push(template(users[i]))
        }

        if (returnElement) {
            return usersTemplates.join("\n");
        } else {
            const container = document.getElementById("users-container");
            container.innerHTML = usersTemplates.join("\n");
        }
    }

    function handleUsersSearchEnter(event) {
        helpers.checkIfEnter(event.key, () => {
            if (event.target.id === "user-search") {
                getUsers(event.target.value, page);
            }
        });
    }

    function navigateToUserDetails(event) {
        const {username} = event.dataset;

        helpers.getUser(username)
            .then(user => {
                if (user) {
                    const newUrl = `user/${user.id}`;
                    history.pushState({page: "user-details", details: {user}}, newUrl, newUrl);
                    const event = new CustomEvent("NavigateToUserDetails", {detail: user});
                    document.dispatchEvent(event);
                }
            });
    }

    function updatePaginationDisabled() {
        helpers.updatePaginationDisabled(paginationDetails);
    }

    function getUsers(search, page) {
        window.helpers.getUsers(search, page)
            .then(data => {
                if (!history.state.page.includes("users")) {
                    return;
                }

                paginationDetails.nextDisabled = page * paginationSize > data.total_count;
                paginationDetails.prevDisabled = page <= 1;
                totalCount = data.total_count;
                searchValue = search;
                users = data.items;

                updatePaginationDisabled();

                const newState = {
                    details: {users, totalCount, page, searchValue},
                    page: "users"
                };

                const newUrl = page > 1 ? `users?page=${page}` : "users";

                history.replaceState(newState, newUrl, newUrl);

                renderUsers();
            });
    }

    function paginateRight() {
        if (!paginationDetails.nextDisabled) {
            page++;
            getUsers(searchValue, page);
        }
    }

    function addListeners() {
        document.addEventListener("keyup", handleUsersSearchEnter);
    }

    function paginateLeft() {
        if (!paginationDetails.prevDisabled) {
            page--;
            getUsers(searchValue, page);
        }
    }

    function reset() {
        paginationDetails = {
            nextDisabled: true,
            prevDisabled: true
        };
        searchValue = "";
        totalCount = 0;
        users = [];
        page = 1;
    }

    function init() {
        const container = document.getElementById("content");
        const usersTemplates = [];

        for (let i = 0; i < users.length; i++) {
            usersTemplates.push(template(users[i]))
        }

        let content = toolTipTemplate({...paginationDetails, placeholder: "Search for users", id: "user"});
        content += `<div id="users-container">${renderUsers(true)}</div>`;
        content += paginationTemplate(paginationDetails);

        container.innerHTML = content;

        const hint = document.getElementById("hint");
        if (hint) {
            hint.remove();
        }

        addListeners();
    }

    window.usersPage = {
        navigateToUserDetails,
        paginateRight,
        paginateLeft,
        init,
        reset
    };

}(window, document, history, helpers, UserBlockTemplate, ToolTipTemplate, PaginationTemplate));