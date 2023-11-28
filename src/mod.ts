import { DependencyContainer } from "tsyringe";
import { ConfigUtil } from "./util/ConfigUtil";
import { LoggingUtil } from "./util/LoggingUtil";
import { ModConfig } from "./model/config/ModConfig";

import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { HideoutService } from "./service/HideoutService";
import { ConfigServer } from '@spt-aki/servers/ConfigServer';
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";

class Mod implements IPostDBLoadMod
{
    private logger: ILogger;
    private configUtil: ConfigUtil = new ConfigUtil();
    private hideoutService: HideoutService;
    private loggingUtil: LoggingUtil;
    private modConfig: ModConfig;

    public preAkiLoad(container: DependencyContainer): void
    {
        //initial logger creation
        this.logger = container.resolve<ILogger>("WinstonLogger");

        //parse the config and store the values
        this.modConfig = this.configUtil.parseConfig(this.logger);

        //switch to logging util that works with mod config flag
        this.loggingUtil = new LoggingUtil(this.logger, this.modConfig);

        //set up the services
        this.hideoutService = new HideoutService(this.loggingUtil);
    }

    public postDBLoad(container: DependencyContainer): void 
    {
        //power check
        if (this.modConfig.global.disableEverything) 
        {
            this.loggingUtil.info("Mod is disabled.")
            return;
        }

        // get the database server data
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        // get all the little bobby tableses
        const dbTables = databaseServer.getTables();

        //make any toggled changes for hideout productions
        if (this.modConfig.hideout.production.enabled)
        {
            this.hideoutService.editProductions(dbTables, this.modConfig);
        }

        //make any toggled changes for hideout scav case
        if (this.modConfig.hideout.scavCase.enabled)
        {
            this.hideoutService.editScavCase(dbTables, this.modConfig);
        }

        //make any toggled changes for the hideout areas
        if (this.modConfig.hideout.area.enabled)
        {
            this.hideoutService.editAreas(dbTables, this.modConfig);
        }
    }
}

module.exports = { mod: new Mod() }