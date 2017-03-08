document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app');

    const templateRequest = axios.get('/template.hbs')
        .then(({data}) => Handlebars.compile(data));

    function refresh() {
        Promise.all([templateRequest, axios.get('/cluster')])
            .then(([template, {data}]) => {
                container.innerHTML = template(data);
                setTimeout(refresh, 1000);
            });
    }

    refresh();
});
