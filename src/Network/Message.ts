export default class WargMessage{
    
    name: string
    value:any
    
    static reqId = 0;

    static PING_DELAY: number = 3000
    static PING_MESSAGE: string = "{\"name\":\"Ping\",\"value\":null}";

    constructor(name: string, value: any){
        this.name = name;
        this.value = value;
    }

    toMessage(useFullSize:  boolean = false): Buffer{
        let json = JSON.stringify(this);
        let size: number = (useFullSize) ? 1024 : json.length + 12;
        let buffer = Buffer.alloc(size)
        //Populate Header
        var pos = buffer.writeInt32BE(json.length + 8)
        pos = buffer.writeUInt32BE(1, pos)
        WargMessage.reqId++;
        pos = buffer.writeUInt32BE(0, pos)
        buffer.write(json, pos)
        return buffer;
    }

    static fromMessage(bytes: Buffer): WargMessage {
        var pos = 0
        var size = bytes.readInt32BE()
        pos += 4
        var requestId = bytes.readUInt32BE(pos)
        pos += 4
        var flag = bytes.readUInt32BE(pos)
        pos += 4
        var json = JSON.parse(bytes.toString("utf-8", pos))
        return new WargMessage(json["name"], json["value"])
    }

    static getPing(): Buffer{
        let size: number = 1024
        let buffer = Buffer.alloc(size)
        let json = this.PING_MESSAGE;
        //Populate Header
        var pos = buffer.writeInt32BE(json.length + 8)
        pos = buffer.writeUInt32BE(0, pos)
        pos = buffer.writeUInt32BE(4, pos)
        buffer.write(json, pos)
        return buffer;
    }

}