
import { Connector } from "./Connector";

export class Service {
    private connector: Connector = new Connector();
    private lastResponse: Response = new Response();

    public login(email: string, password: string): Promise<Service>
    {
        return this.connector.login(email, password).then((response: Response) => {
            this.lastResponse = response;
            return this;
        })
    }

    public setJwt(token: string)
    {
        this.connector.setJwToken(token);
    }

    public getResponse(): Response
    {
        return this.lastResponse;
    }

    public getConnector(): Connector {
        return this.connector;
    }

    public checkAccess(): boolean
    {
        return this.connector.isUserAutorized();
    }

    public getFetchOfServer(apiURL: string): Promise<Service>
    {
        return this.connector.getFetchOfServer(apiURL).then((response: Response) => {
            this.lastResponse = response;
            return this;
        });
    }
}