import dotenv from "dotenv";
import HttpStatus from "http-status-codes";
import { ConnectorInterface } from "./interface/ConnectorInterface";
import { ApiUrls } from "./ApiUrls";
import { response } from "express";

export class Connector implements ConnectorInterface {
    private siteURL: string | undefined;
    private jwToken: string | undefined;

    public constructor()
    {
        dotenv.config();
        this.siteURL = (process.env.SERVER || "") + 'api';
    }

    public async getUserToken(): Promise<string | null> {

        let token = null;

        await fetch(this.siteURL + ApiUrls.GET_USER_TOKEN, {
            method: "POST"
        }).then((res: Response) => {
            if (res.status == HttpStatus.OK) {
                console.log(res.body);
                token = res.json().then(result => {
                    return result.token;
                })
            }
        })

        return token;
    }

    public isUserAutorized(): boolean
    {
        return this.jwToken != undefined;
    }

    public setJwToken(token: string) {
        this.jwToken = token;
    }

    public getFetchOfServer(apiURL: string): Promise<Response>
    {
        const formData = new FormData();
        formData.append("jwt", this.jwToken ? this.jwToken : "");

        return fetch(this.siteURL + apiURL, {
            method: "POST",
            body: formData
        })
    }

    public async login(email: string, password: string): Promise<Response>
    {
        if (this.isUserAutorized()) console.log("User already autorizated");

        const formData = this.buildUserFormData(email, password);
        return fetch(this.siteURL + "/login", {
            method: "POST",
            body: formData
        }).then((response: Response) => {
            return response.json().then((body) => {
                if (response.status == HttpStatus.OK) 
                {
                    this.jwToken = body.jwt_token;
                    console.log(body.message)
                }

                else console.log(body);
                return response;
            });

        })
    }

    public buildUserFormData(email: string, password: string): FormData
    {
        const formData = new FormData();

        formData.append("email", email)
        formData.append("password", password);

        return formData;
    }

    public getSiteURL(): string | undefined
    {
        return this.siteURL;
    }
}
