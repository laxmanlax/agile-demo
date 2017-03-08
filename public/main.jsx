class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {items: []};
    }

    componentDidMount() {
        window.setInterval(() => this.refresh(), 1000);
    }

    refresh() {
        axios.get('/cluster')
            .then(({data: {items}}) => {
                this.setState({items});
            });
    }

    render() {
        const {items} = this.state;
        return <ClusterItems items={items}/>;
    }
}

const ClusterItems = ({items}) => <ul className="cluster-items">
    {items.map(item => <li><ClusterItem item={item}/></li>)}
</ul>;

const ClusterItem = ({item: {metadata, spec, status}}) => {
    const id = metadata.labels.version || metadata.labels.app || 'app';
    return <div className="cluster-item">
        <img src={`https://api.adorable.io/avatars/200/${id}.png`}/>
        <dl>
            <dt>Name</dt>
            <dd>{metadata.name}</dd>
            <dt>Status</dt>
            <dd>{status.phase}</dd>
            <dt>Image</dt>
            <dd>{spec.containers[0].image}</dd>
            <dt>Labels</dt>
            <dd>
                <ul className="cluster-item-labels">
                    {Object.keys(metadata.labels).map(key =>
                        <li className="cluster-item-label">
                            <em>{key}:</em> {metadata.labels[key]}
                        </li>)}
                </ul>
            </dd>
        </dl>
    </div>;
};

ReactDOM.render(<App/>, document.getElementById('app'));
