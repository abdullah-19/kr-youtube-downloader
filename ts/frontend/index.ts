
import { UrlManager } from "./UrlManager";

class Main{

    private readonly downloadBtn:HTMLElement = <HTMLElement>document.getElementById('downloadBtn');
    private readonly urlField:HTMLInputElement = <HTMLInputElement>document.getElementById('urlField');
    private urlManager:UrlManager = new UrlManager();

    constructor(){
        this.init();
    }

    private init():void{
        this.downloadBtn.addEventListener('click', ()=> {
            this.start_process();
        });
    }

    private start_process():void{
        console.log('---starting process---');
        let url:string = this.urlField.value;
        url = url.trim();
        if(this.urlManager.isValidUrl(url)) console.log('valid url');
        else console.log('not valid url');
        
    }
}

new Main();