import { Constants } from "./Constants";
import HTTPS from 'https'
import FS from 'fs'
import GatewaySocket from "./Network/GatewaySocket";
import WargMessage from "./Network/Message";
import RequestConnectionServiceWithVersion from "./Network/Messages/RequestConnectionServiceWithVersion";
import WargClient from "./Network/WargClient"
import { IncomingMessage, ServerResponse } from "http";

export default class TCGOApp {

    public static instance: TCGOApp

    gatewayClient: GatewaySocket
    wargClient: WargClient
    apiServer: HTTPS.Server

    options = {
        key: FS.readFileSync('/etc/letsencrypt/live/api.poke.codes/privkey.pem'),
        cert: FS.readFileSync('/etc/letsencrypt/live/api.poke.codes/fullchain.pem'),
        //key: FS.readFileSync('./key.pem'),
        //cert: FS.readFileSync('./cert.pem'),
        rejectUnauthorized: false
    }


    constructor(){
        TCGOApp.instance = this
        console.log("Pokemon TCGO WargClient")
        console.log("=================================")
        // API Server
        this.apiServer = HTTPS.createServer(this.options, this.onRequest).listen(443, "0.0.0.0");
        this.gatewayClient = new GatewaySocket()
        this.gatewayClient.request( new WargMessage( "RequestConnectionServiceWithVersion", new RequestConnectionServiceWithVersion(Constants.clientParameters.clientVersion)) )
            .then((value:string) =>{
                let ipSplit = value.split(':')
                this.wargClient = new WargClient(ipSplit[0], Number.parseInt(ipSplit[1]))
            })
    }

    async onRequest(req: IncomingMessage, res: ServerResponse){
        let split = req.url.split('/')
        console.log("Requested: " + req.url)
        switch(split[1]){
            case "check-code":
                if(TCGOApp.instance.wargClient != null) {
                    if(TCGOApp.instance.wargClient.connected) {
                        await TCGOApp.instance.wargClient.requestCode(split[2]).then((code) => {
                            res.setHeader("content-type", "application/json")
                            res.writeHead(200);
                            res.end(JSON.stringify(code))
                        })
                    } else {
                        res.writeHead(401);
                        res.end("Error on the API end. 4001")
                    }
                } else {
                    res.writeHead(401);
                    res.end("Error on the API end. 4002")
                }
                break
                default:
                    res.writeHead(404);
                    res.end("Not found")
                    break
        }
    }

}