import { ModConfig } from "../model/config/ModConfig";

import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

export class LoggingUtil 
{
    constructor(private logger: ILogger, private modConfig?: ModConfig) 
    {
        if (modConfig && this.modConfig.global.showMeTheLogs == undefined) 
        {
            this.logger.error("CONFIG EMPORIUM: You broke the logging field ( showMeTheLogs ) for my mod. Could have been me but I choose to blame you. No logs for this mod will properly show if toggled.")
        }
    }

    public success(message: string) : void
    {
        if (this.modConfig.global.showMeTheLogs) 
        {
            this.logger.success(`CONFIG EMPORIUM: ${message}`);
        }
    }

    public info(message: string) : void
    {
        if (this.modConfig.global.showMeTheLogs) 
        {
            this.logger.info(`CONFIG EMPORIUM: ${message}`);
        }
    }

    public error(message: string) : void
    {
        if (this.modConfig.global.showMeTheLogs) 
        {
            this.logger.error(`CONFIG EMPORIUM: ${message}`);
        }
    }

}