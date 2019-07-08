
export class UrlManager{

    public isValidUrl(url:string):boolean{
        let pattern:RegExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if(url.match(pattern)) return true;
        if(this.isPlaylist(url)) return true;
        return false;
    }

    public isPlaylist(url:string){
        let pattern:RegExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?list=))((\w|-))(?:\S+)?$/;
        if(url.match(pattern)) return true;
        return false;
        
    }
}