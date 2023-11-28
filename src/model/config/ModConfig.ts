import { Global } from "./Global";
import { Hideout } from "./Hideout";

export class ModConfig 
{
    public global: Global;
    public hideout: Hideout;
    
    public constructor(disableEverything: boolean, showMeTheLogs?: boolean) 
    {
        //initialize the globe
        this.global = new Global();

        //set the minimum values we want because we are probably here due to something breaking
        this.global.disableEverything = disableEverything;
        if (showMeTheLogs)
        {
            this.global.showMeTheLogs = showMeTheLogs;
        }
    }

}