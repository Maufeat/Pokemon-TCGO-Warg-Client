import { randomInt } from "crypto";

export const Constants = {
    local: true,
    gatewayHost: "tcgo-gateway.direwolfdigital.com",
    gatewayPort: 39389,
    tcgoHost: "cake-prod-connection-77-8.direwolfdigital.com",
    tcgoPort: 8181,
    clientParameters: {
        clientVersion: "2.78.0.5176",
        clientPlatform: "WindowsPlayer",
        Locale: "en_US",
        DeviceName: "DESKTOP-AM52OBN",
        DeviceModel:"System Product Name (System manufacturer)",
        DeviceType: "Desktop",
        GraphicsDeviceName: "NVIDIA GeForce GTX 1060 6GB",
        GraphicsMemorySize: "3072",
        OperatingSystem: "Windows 10  (10.0.0) 64bit",
        ProcessorType: "AMD Ryzen 5 2600 Six-Core Processor ",
        SystemMemorySize: "24510",
        DeviceID: "maufeat-" + randomInt(9999)
    }
};

export const EditionCodeToLong =  {

    "XY12BST": "XY - Evolutions",
    "XY12BST0": "XY - Evolutions",
    "XY12BST2": "XY - Evolutions",

    "SWSH1BST": "Sword & Shield - Base",
    "SWSH1BST0": "Sword & Shield - Base",
    "SWSH1BST2": "Sword & Shield - Base",

    "SWSH2BST": "Sword & Shield - Rebel Clash",
    "SWSH2BST0": "Sword & Shield - Rebel Clash",
    "SWSH2BST2": "Sword & Shield - Rebel Clash",

    "SWSH4BST": "Sword & Shield - Vivid Voltage",
    "SWSH4BST0": "Sword & Shield - Vivid Voltage",
    "SWSH4BST2": "Sword & Shield - Vivid Voltage",
    
    "SM1BST": "Sun & Moon - Base",
    "SM1BST0": "Sun & Moon - Base",
    "SM1BST2": "Sun & Moon - Base",

    "SM12BST": "Sun & Moon - Cosmic Eclipse",
    "SM12BST0": "Sun & Moon - Cosmic Eclipse",
    "SM12BST2": "Sun & Moon - Cosmic Eclipse",

    "SM3BST": "Sun & Moon - Burning Shadows",
    "SM3BST0": "Sun & Moon - Burning Shadows",
    "SM3BST2": "Sun & Moon - Burning Shadows",

    "SM35BST": "Shining Legends",

    //Champions Path
    "CPBST": "Champion's Path",
    "CPHRNV": "Hatterene V (Champion's Path)",

    //Shining Fates
    "SFBST": "Shining Fates",
    "SFCLPIK": "Collection Pikachu-V (Shining Fates)",

    //Collectors Chest
    "CCF20": "Rillaboom, Cinderace, Inteleon (Collector's Chest)",

    //Specials
    "PIKEEVSC": "Pikachu-GX & Eevvee-GX Special Collection",
    "SP20TNCRC": "Galar Partners: Cinderace V",
}