export interface ConnectorInterface {
    login(email: string, password: string): void;
    getFetchOfServer(apiURL: string): Promise<Response> | null; 
    isUserAutorized(): boolean;
}