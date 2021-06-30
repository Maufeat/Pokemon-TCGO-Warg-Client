import { Constants } from "../../Constants";

export default class RequestSession
{
    connectionInfo: any;

    constructor()
    {
        this.connectionInfo = {
            "hostName": "foo",
            "countryCode": "en_US",
            clientParameters: Constants.clientParameters
        }
    }
}