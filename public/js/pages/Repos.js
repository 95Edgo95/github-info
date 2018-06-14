(function (window, document, history, helpers, template, toolTipTemplate, paginationTemplate) {
    const paginationSize = 20;

    let paginationDetails = {
        nextDisabled: true,
        prevDisabled: true
    };
    let searchValue = "";
    let totalCount = 0;
    let repos = [];
    let page = 1;

    if (history.state && history.state.details) {
        searchValue = history.state.details.searchValue;
        totalCount = history.state.details.totalCount;
        repos = history.state.details.repos;
        page = history.state.details.page;

        paginationDetails.nextDisabled = page * paginationSize > totalCount;
        paginationDetails.prevDisabled = page <= 1;
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

    function handleReposSearchEnter(event) {
        helpers.checkIfEnter(event.key, () => {
            if (event.target.id === "repo-search") {
                getRepos(event.target.value, page);
            }
        });
    }

    function updatePaginationDisabled() {
        helpers.updatePaginationDisabled(paginationDetails);
    }

    function getRepos(search, page) {
        window.helpers.getRepos(search, page, "name,description")
            .then(data => {
                if (!history.state.page.includes("repos")) {
                    return;
                }

                paginationDetails.nextDisabled = page * paginationSize > data.total_count;
                paginationDetails.prevDisabled = page <= 1;
                totalCount = data.total_count;
                searchValue = search;
                repos = data.items;

                updatePaginationDisabled();

                const newState = {
                    details: {repos, totalCount, page, searchValue},
                    page: "repos"
                };
                const newUrl = page > 1 ? `repos?page=${page}` : "repos";

                history.replaceState(newState, newUrl, newUrl);

                renderRepos();
            });
    }

    function paginateRight() {
        if (!paginationDetails.nextDisabled) {
            page++;
            getRepos(searchValue, page);
        }
    }

    function addListeners() {
        document.addEventListener("keyup", handleReposSearchEnter);
    }

    function paginateLeft() {
        if (!paginationDetails.prevDisabled) {
            page--;
            getRepos(searchValue, page);
        }
    }

    function init() {
        const container = document.getElementById("content");
        const reposTemplates = [];

        for (let i = 0; i < repos.length; i++) {
            reposTemplates.push(template(repos[i]))
        }

        let content = toolTipTemplate({...paginationDetails, placeholder: "Search for repos", id: "repo"});
        content += `<div id="repos-container">${renderRepos(true)}</div>`;
        content += paginationTemplate(paginationDetails);

        container.innerHTML = content;

        const hint = document.getElementById("hint");
        if (hint) {
            hint.remove();
        }

        addListeners();
    }

    function reset() {
        paginationDetails = {
            nextDisabled: true,
            prevDisabled: true
        };
        searchValue = "";
        totalCount = 0;
        repos = [];
        page = 1;
    }

    window.reposPage = {
        paginateRight,
        paginateLeft,
        init,
        reset
    };

}(window, document, history, helpers, RepoRowTemplate, ToolTipTemplate, PaginationTemplate));