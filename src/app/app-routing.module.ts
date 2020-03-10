import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PDVComponent } from './pages/pdv/pdv.component';
import { CozinhaComponent } from './pages/cozinha/cozinha.component';
import { RetiradaComponent } from './pages/retirada/retirada.component';


const routes: Routes = [
   { path: '', component: PDVComponent },
   { path: 'cozinha', component: CozinhaComponent },
   { path: 'retirada', component: RetiradaComponent }
];

@NgModule({
   imports: [RouterModule.forRoot(routes, { useHash: false })],
   exports: [RouterModule]
})
export class AppRoutingModule { }
