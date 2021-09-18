import { NgModule } from "@angular/core";
import { LoadingBarComponent } from "./components/loading-bar/loading-bar.component";
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from "@angular/common";

const baseDeclarations = [
    LoadingBarComponent,
    FooterComponent,
    HeaderComponent
]

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ...baseDeclarations
    ],
    exports: [
        ...baseDeclarations
    ]
})
export class SharedModule { }