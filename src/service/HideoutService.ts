import { ID } from "../model/common/enum/ID";
import { ModConfig } from "../model/config/ModConfig";
import { LoggingUtil } from "../util/LoggingUtil";

import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";

export class HideoutService
{
    constructor(private loggingUtil: LoggingUtil)
    {}

    public editProductions(dbTables: IDatabaseTables, modConfig: ModConfig) : void
    {
        // grab the hideout. kinda sucks at hiding
        const hideoutTable = dbTables.hideout;
        //hideout production loop
        hideoutTable.production.forEach( (production) =>
        {
            //basically all production timers that aren't bitcoin or water production
            if (!production.continuous)
            {
                production.productionTime *= modConfig.hideout.production.productionTimeMultiplier;
            }

            //edit the bitcoin production data
            if (production._id === ID.BTC_PRODUCTION_ID) 
            {
                production.productionTime = modConfig.hideout.production.minutesForBTC * 60;
                this.loggingUtil.info(`Bitcoin production time has been set to: ${production.productionTime} (${modConfig.hideout.production.minutesForBTC} multiplied by 60)`);
            }

            //edit the dsp production data
            if (modConfig.hideout.production.turnOffDSPTransmitterFuelRequirement && production._id == ID.DSP_PRODUCTION_ID)
            {
                production.needFuelForAllProductionTime = false;
                this.loggingUtil.info(`needFuelForAllProductionTime set to ${production.needFuelForAllProductionTime} for the DSP Transmitter.`);
            }
        });
    }

    public editScavCase(dbTables: IDatabaseTables, modConfig: ModConfig) : void
    {
        // grab the hideout. kinda sucks at hiding
        const hideoutTable = dbTables.hideout;
        //hideout scav case loop
        hideoutTable.scavcase.forEach( (production) =>
        {
            // apply the production multiplier
            production.ProductionTime *= modConfig.hideout.scavCase.returnTimeMultiplier;
            this.loggingUtil.info(`Production time for scav case ${production._id} was set to ${production.ProductionTime} using the multiplier of ${modConfig.hideout.scavCase.returnTimeMultiplier}.`)

            if (production._id == ID.SCAV_CASE_2500 || production._id == ID.SCAV_CASE_15000 || production._id == ID.SCAV_CASE_95000)
            {
                //apply the rouble cost multiplier
                production.Requirements[0].count *= modConfig.hideout.scavCase.roubleCostMultiplier;
                this.loggingUtil.info(`Production cost of for scav case ${production._id} was set to ${production.Requirements[0].count} using the multiplier of ${modConfig.hideout.scavCase.roubleCostMultiplier}.`)
            }
        });
    }

    public editAreas(dbTables: IDatabaseTables, modConfig: ModConfig) : void
    {
        // grab the hideout. kinda sucks at hiding
        const hideoutTable = dbTables.hideout;
        //hideout area loop
        hideoutTable.areas.forEach( (area) =>
        {
            for (const id in area.stages)
            {
                if (modConfig.hideout.area.noConstructionRequirements)
                {
                    // wipe the reqs
                    area.stages[id].requirements = []
                    this.loggingUtil.info(`Requirements have been cleared for stage ${id} of area id ${area._id}.`)
                }

                // wipe the reqs
                area.stages[id].constructionTime *= modConfig.hideout.area.constructionTimeMultiplier;
                this.loggingUtil.info(`Construction time for stage ${id} of area id ${area._id} has been set to ${area.stages[id].constructionTime}.`)
            }
        });
    }
}