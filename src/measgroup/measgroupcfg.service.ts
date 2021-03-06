import { HttpAPI } from '../common/httpAPI'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

declare var _:any;

@Injectable()
export class MeasGroupService {

    constructor(public httpAPI: HttpAPI) {
        console.log('Task Service created.', httpAPI);
    }

    addMeasGroup(dev) {
        return this.httpAPI.post('/measgroups',JSON.stringify(dev,function (key,value) {
            if ( key == 'Measurements' ) {
              if (value != null) return String(value).split(',');
              else return null;
            }
                return value;
        }))
        .map( (responseData) => responseData.json());
    }

    editMeasGroup(dev, id) {
        console.log("DEV: ",dev);
        //TODO: Se tiene que coger el oldid para substituir en la configuración lo que toque!!!!
        return this.httpAPI.put('/measgroups/'+id,JSON.stringify(dev,function (key,value) {
            if ( key == 'Measurements' ) {
              if (value != null) return String(value).split(',');
              else return null;
            }
            return value;
        }))
        .map( (responseData) => responseData.json());
    }

    getMeasGroup(filter_s: string) {
        // return an observable
        return this.httpAPI.get('/measgroups')
        .map( (responseData) => {
            return responseData.json();
        })
        .map((measgroups) => {
            console.log("MAP SERVICE",measgroups);
            let result = [];
            if (measgroups) {
                _.forEach(measgroups,function(value,key){
                    console.log("FOREACH LOOP",value,value.ID);
                    if(filter_s && filter_s.length > 0 ) {
                        console.log("maching: "+value.ID+ "filter: "+filter_s);
                        var re = new RegExp(filter_s, 'gi');
                        if (value.ID.match(re)){
                            result.push(value);
                        }
                        console.log(value.ID.match(re));
                    } else {
                        result.push(value);
                    }
                });
            }
            return result;
        });
    }
    getMeasGroupById(id : string) {
        // return an observable
        console.log("ID: ",id);
        return this.httpAPI.get('/measgroups/'+id)
        .map( (responseData) =>
            responseData.json()
    )};

    checkOnDeleteMeasGroups(id : string){
      return this.httpAPI.get('/measgroups/checkondel/'+id)
      .map( (responseData) =>
       responseData.json()
      ).map((deleteobject) => {
          console.log("MAP SERVICE",deleteobject);
          let result : any = {'ID' : id};
          _.forEach(deleteobject,function(value,key){
              result[value.Type] = [];
          });
          _.forEach(deleteobject,function(value,key){
              result[value.Type].Description=value.Action;
              result[value.Type].push(value.ObID);
          });
          return result;
      });
    };

    deleteMeasGroup(id : string) {
        // return an observable
        console.log("ID: ",id);
        console.log("DELETING");
        return this.httpAPI.delete('/measgroups/'+id)
        .map( (responseData) =>
         responseData.json()
        );
    };
}
