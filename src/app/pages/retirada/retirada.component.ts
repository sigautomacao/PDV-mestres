import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';
import { ModelService } from 'src/app/services/model.service';

@Component({
   selector: 'app-retirada',
   templateUrl: './retirada.component.html',
   styleUrls: ['./retirada.component.scss']
})
export class RetiradaComponent implements OnInit {

   //dados do Pedido
   vendaCurrent: any = {};

   //variavel que toca o som da notificação
   player = new Audio('assets/songs/notifica_song.mp3');

   interval = null;

   constructor(private model: ModelService, private message: MessagesService, ) {

   }

   ngOnInit(): void {
      //cria um intervalo de 10 segungos a cada verirficação
      this.interval = setInterval(() => {
         this.get_notification();
      }, 10000);
   }

   get_notification() {

      // this.message.loadingInit();
      this.model.http.post(this.model.baseURL + 'cozinha-notification.php', {}).subscribe((data: any) => {
         // this.message.loadingDiss();

         if (data.retorno == 1) {
            this.player.play();
            this.vendaCurrent = data.venda;

            //pausa a notificação
            // setTimeout(() => {
            //    this.player.pause();
            // }, 1000);

            //após 25 segundos retira da tela os dados
            setTimeout(() => {
               this.vendaCurrent = {};
            }, 40000);

            this.remove_notification(data.venda.id);
            
         }

      }, erro => {
         // this.message.loadingDiss();
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      });
   }

   remove_notification(id_notifica) {
      this.model.http.post(this.model.baseURL + 'cozinha-notification-remove.php', { 'id_notifica': id_notifica }).subscribe(() => {

      }, erro => {
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      });
   }

}
