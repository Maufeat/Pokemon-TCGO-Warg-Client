import TLS, { TLSSocket } from 'tls'
import FS from 'fs'
import { Constants } from '../Constants';
import WargMessage from './Message';
import RequestConnectionServiceWithVersion from './Messages/RequestConnectionServiceWithVersion';
import WargClient from './WargClient';
import { Console } from 'console';
import RequestSession from './Messages/RequestSession';
import { report } from 'process';
import delay from '../Utils';
import TCGOApp from '../TCGOApp';

export default class GatewaySocket {

    gatewaySocket: TLS.TLSSocket
    connected: boolean

    messageRequests:{name:string, response:string}[] = []

    constructor(){

        this.gatewaySocket = TLS.connect(Constants.gatewayPort, Constants.gatewayHost, TCGOApp.instance.options, () => {
                console.log("GatewaySocket Connected")
                this.connected = true
                setInterval(() => {
                    if(this.connected)
                        this.gatewaySocket.write(WargMessage.getPing())
                }, 1000)
        })

        this.gatewaySocket.on("error", (err: Error) => {
            console.log("Error: " + err.message);
        })
        this.gatewaySocket.on("close", () =>{
            this.connected = false
            console.log("GatewaySocket closed");
        })
        this.gatewaySocket.on('data', (data: Buffer) =>{
            let packet = WargMessage.fromMessage(data)
            if(packet.name == "ConnectionService") {
                this.messageRequests.find(x => x.name == "RequestConnectionServiceWithVersion").response = packet.value["connectionEndPoint"]
                this.gatewaySocket.end()
            }
        })
    }

    async request(message: WargMessage): Promise<string>{
        // Add to requests, listen to response  
        let awaitResponse = {name: message.name, response: ""}
        this.messageRequests.push(awaitResponse)
        // Send Request
        var requestEndPoint = message
        this.gatewaySocket.write(requestEndPoint.toMessage())
        while(awaitResponse.response == ""){
            await delay(100)
        }
        this.messageRequests = this.messageRequests.slice(this.messageRequests.indexOf(awaitResponse), 1)
        return new Promise<string>(resolve => { resolve(awaitResponse.response) })
    }

}