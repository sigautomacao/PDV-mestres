import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessagesService } from 'src/app/services/messages.service';
import { ModelService } from 'src/app/services/model.service';

@Component({
   selector: 'app-cozinha',
   templateUrl: './cozinha.component.html',
   styleUrls: ['./cozinha.component.scss']
})
export class CozinhaComponent implements OnInit {

   //variaveis de modais
   @ViewChild('modalVendaDetalhe') modalVendaDetalhe: ElementRef;
   venda_detalhe_modal = null;

   //lista de vendas
   vendasList = [];

   //detalhe da venda
   vendaDetalhe: any = {};

   interval = null;

   constructor(private model: ModelService, private modalService: NgbModal, private message: MessagesService, private zone: NgZone) {
      this.list_vendas();
   }

   ngOnInit(): void {
      this.interval = setInterval(() => {
         this.list_vendas();
      }, 10000);
   }

   list_vendas() {

      // this.message.loadingInit();
      this.model.http.post(this.model.baseURL + 'cozinha-list.php', {}).subscribe((data: any) => {
         // this.message.loadingDiss();

         this.vendasList = data;
      }, erro => {
         // this.message.loadingDiss();
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      });
   }

   get_venda(id_venda) {
      this.message.loadingInit();
      this.model.http.post(this.model.baseURL + 'cozinha-venda_detalhe.php', { 'id_venda': id_venda }).subscribe((data: any) => {
         this.message.loadingDiss();

         this.vendaDetalhe = data;

         this.venda_detalhe_modal = this.modalService.open(this.modalVendaDetalhe, {
            size: 'lg',
            backdrop: 'static',
         });

      }, erro => {
         this.message.loadingDiss();
         this.message.alertErro(erro.error.text, 'Ops!');
      });

   }

   finalizar(id_venda) {
      this.message.swal.fire({
         title: 'O pedido está pronto ?',
         showCancelButton: true,
         cancelButtonText: 'Não',
         confirmButtonText: 'Sim',
         showLoaderOnConfirm: true,
         customClass: { popup: 'swal2-sm' }
      }).then((result) => {
         console.log(result);
         if (result.value && result.value != '') {

            this.message.loadingInit();
            this.model.http.post(this.model.baseURL + 'cozinha-finalizar.php', { 'id_venda': id_venda }).subscribe(() => {
               this.message.loadingDiss();
               //limpa venda temporaria
               this.vendaDetalhe = {};

               this.list_vendas();

               //fecha modal
               this.venda_detalhe_modal.close();
            }, erro => {
               this.message.loadingDiss();
               this.message.alertErro(erro.error.text, 'Ops!');
               console.log(erro);
            });

         }
      })
   }

}
