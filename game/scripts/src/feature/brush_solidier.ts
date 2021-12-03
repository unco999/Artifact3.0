import { BattleArea, GoUp, LaidDown, Midway, Scenes } from "../instance/Scenes";
import { Solider } from "../instance/Unit";
import { reloadable } from "../lib/tstl-utils";

/** 主要控制刷修小兵 */
@reloadable
export class brash_solidier{

    constructor(){
        CustomGameEventManager.RegisterListener("C2S_BRUSH_SOLIDER",()=>{
            brash_solidier.brushTwoSoldiers()
        })
    }

    static brachSelect(PlayerID:PlayerID){
        const GoUp = (GameRules.SceneManager.GetGoUpScene(PlayerID) as GoUp).getbrachoption();
        const LaidDown = (GameRules.SceneManager.GetLaidDownScene(PlayerID) as LaidDown).getbrachoption();
        const Midway = (GameRules.SceneManager.GetMidwayScene(PlayerID) as Midway).getbrachoption();
        const GoUpSelect = this.route(GoUp as [number,number])
        const LaidDownSelect = this.route(LaidDown as [number,number])
        const MidwaySelect = this.route(Midway as [number,number])
        GoUpSelect && this.actuallyBrushingSoldiers(GoUpSelect,PlayerID,GameRules.SceneManager.GetGoUpScene(PlayerID) as BattleArea)
        LaidDownSelect && this.actuallyBrushingSoldiers(LaidDownSelect,PlayerID,GameRules.SceneManager.GetLaidDownScene(PlayerID) as BattleArea)
        MidwaySelect && this.actuallyBrushingSoldiers(MidwaySelect,PlayerID,GameRules.SceneManager.GetMidwayScene(PlayerID) as BattleArea)
    }

    /**实际刷兵API */
    static actuallyBrushingSoldiers(index:number,PlayerID:PlayerID,scene_name:BattleArea){
        const soldier = new Solider({Id:math.random().toString(),Index:index,PlayerID:PlayerID},scene_name)
        scene_name.AutoAddCard(soldier,index)
        GameRules.SceneManager.global_add(soldier.UUID,soldier)
        GameRules.SceneManager.update_summon()
        CustomGameEventManager.Send_ServerToAllClients("S2C_BRUSH_SOLIDER",{})
    }

    /**同时刷两边小兵 */
    static brushTwoSoldiers(){
        this.brachSelect(GameRules.Blue.GetPlayerID())
        this.brachSelect(GameRules.Red.GetPlayerID());
        (GameRules.SceneManager.GetMidwayScene(GameRules.Blue.GetPlayerID()) as BattleArea).Print()
    }

    static route(brach:[number,number]):number{
        print("打印選擇")
        DeepPrintTable(brach)
        const number1 = brach[0]
        const number2 = brach[1]
        if(number1 == -1 && number2 != -1){
            print("直接返回",number2)
            return number2
        }
        if(number2 == -1 && number1 != -1){
            print("直接返回",number1)
            return number1
        }
        if(number1 == -1 && number2 == -1){
            return null
        }
        const scalar1 = math.abs(number1 - 2.5)
        const scalar2 = math.abs(number2 - 2.5)
        let selecet_number = scalar1 > scalar2 ? number2 : number1
        if(scalar1 == scalar2){
            print("兩邊相當")
            selecet_number = number2
        }
        print("選擇后返回selecet",selecet_number)
        return selecet_number
    }
}