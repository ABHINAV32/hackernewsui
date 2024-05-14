import { NgModule } from "@angular/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

@NgModule({
    exports:[
        MatPaginatorModule,
        MatTableModule,
        MatSortModule
    ]
})

export class MaterialModule{

}