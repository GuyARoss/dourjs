interface RoutingContext {
    method: string,
    postData: { [id: string]: any },
    urlParams: { [id: string]: any },
}

export default RoutingContext;
