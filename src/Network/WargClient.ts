import TLS, { TLSSocket } from 'tls'
import HTTPS from 'https'
import FS from 'fs'
import { Constants } from '../Constants';
import WargMessage from './Message';
import RequestConnectionServiceWithVersion from './Messages/RequestConnectionServiceWithVersion';
import RequestSession from './Messages/RequestSession';
import delay from '../Utils';
import GatewaySocket from './GatewaySocket';
import { randomInt } from 'crypto';
import TCGOApp from '../TCGOApp';

export default class WargClient {

    wargClient: TLS.TLSSocket
    connected: boolean
    sessionId: string
    authSession: WargMessage
    pingTimer: NodeJS.Timeout
    apiServer: HTTPS.Server

    codeRequests:{code:string, response:any}[] = []

    constructor(ip: string, port: number){

        this.wargClient = TLS.connect(port, ip, TCGOApp.instance.options, async () => {
            await delay(100)
            this.onConnect()
        })

        this.wargClient.on("error", (err: Error) => {
            console.log("Error: " + err.message)
        })

        this.wargClient.on('close', () =>{
            this.connected = false
            clearTimeout(this.pingTimer)
            this.pingTimer = null
            console.log("WargClient Closed")
            Constants.clientParameters.DeviceID = "maufeat-" + randomInt(9999)
            TCGOApp.instance.gatewayClient = new GatewaySocket()
            TCGOApp.instance.gatewayClient.request( new WargMessage( "RequestConnectionServiceWithVersion", new RequestConnectionServiceWithVersion(Constants.clientParameters.clientVersion)) )
                .then((value:string) =>{
                    console.log(value)
                    let ipSplit = value.split(':')
                    TCGOApp.instance.wargClient = null
                    TCGOApp.instance.wargClient = new WargClient(ipSplit[0], Number.parseInt(ipSplit[1]))
                })
        })
        this.wargClient.on('data', (data: Buffer) =>{
            var packet = WargMessage.fromMessage(data)
            switch(packet.name){
                case "Pong":
                    break
                case "GrantedSession":
                    this.sessionId = packet.value["session"]
                    console.log("Granted Session")
                    var requestLogin = new WargMessage("RequestLogin", null)
                    this.wargClient.write(requestLogin.toMessage())
                    break
                case "RequestedAuthType":
                    if(packet.value["validAuthTypes"].includes('DeviceID')){
                        console.log("Login via DeviceID")
                        var startAuth = new WargMessage("StartAuthentication", {"authType": "DeviceID"})
                        this.wargClient.write(startAuth.toMessage())
                        var sendAuth = new WargMessage("AuthenticateDeviceID", {"deviceID": Constants.clientParameters.DeviceID})
                        this.wargClient.write(sendAuth.toMessage())
                    }
                    break
                case "AuthenticationSuccessful":
                    this.authSession = packet
                    console.log("Successfully logged in as " + Constants.clientParameters.DeviceID)
                    break
                case "InvalidCode":
                    switch(packet.value["reason"]){
                        case "$$$shop.error.redemption.codealreadyredeemedbyother$$$":
                            packet.value["reason"] = "AlreadyRedeemed"
                            break
                        case "$$$com.direwolfdigital.cake.commerce.service.InvalidCode$$$":
                            packet.value["reason"] = "InvalidCode"
                            break
                    }
                    packet.value["reason"]
                    this.codeRequests.find(x => x.code == packet.value["code"]).response = packet
                    console.log("Code " + packet.value["code"] + " is invalid")
                    break
                case "CodeIsValid":
                    this.codeRequests.find(x => x.code == packet.value["code"]).response = packet
                    console.log("Code " + packet.value["code"] + " is valid")
                    break
                default:
                    //console.log(packet)
            }
        })
    }

    async onConnect(){
        console.log("WargClient Connected")
        this.connected = true;
        this.pingTimer = setInterval(() => {
            if(this.connected)
                this.wargClient.write(WargMessage.getPing())
        }, 1000)

        var requestSession = new WargMessage("RequestSession", new RequestSession())
        this.wargClient.write(requestSession.toMessage())
    }

    async requestCode(code: string): Promise<any>{
        let awaitResponse = {code: code, response: ""}
        console.log("Checking Code: " + code)
        this.codeRequests.push(awaitResponse)
        // Send Request
        this.wargClient.write(new WargMessage("ValidateCode", {"code": code}).toMessage())
        let timeout = 0
        while(awaitResponse.response == "" || timeout >= 5000 ){
            let responseTime = 100
            timeout += responseTime
            await delay(responseTime)
        }
        
        this.codeRequests.forEach( (item, index) => {
            if(item === awaitResponse) this.codeRequests.splice(index,1);
        });

        if(timeout >= 5000){
            awaitResponse.response = "timeout"
        }

        return new Promise<any>(resolve => { resolve(awaitResponse.response) })
    }
}
