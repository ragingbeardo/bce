import { container } from "tsyringe";
import { ModConfig } from "../model/config/ModConfig";

import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { VFS } from "@spt-aki/utils/VFS";

import JSON5 from "json5";

import path from "path";

export class ConfigUtil
{
    public parseConfig(logger:ILogger): ModConfig
    {
        // VFS for reading the config
        const vfs = container.resolve<VFS>("VFS");

        let modConfig: ModConfig = null;
        // attempt to parse the config file
        try 
        {
            modConfig = JSON5.parse(vfs.readFile(path.resolve(__dirname, "../config/config.json5")));
        } 
        catch (error) 
        {
            logger.error("CONFIG EMPORIUM: Disabling mod due to an error parsing the config file. Make sure your values are set up correctly.");
            //creates a mod config that is disabled with logs enabled for good measure since something broke
            modConfig = new ModConfig(true, true);
        }
        
        return modConfig;
    }
}