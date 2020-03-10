import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelService } from 'src/app/services/model.service';

declare var qz;
import * as qz from 'qz-tray';
import { sha256 } from 'js-sha256';


@Component({
   selector: 'app-pdv',
   templateUrl: './pdv.component.html',
   styleUrls: ['./pdv.component.scss']
})
export class PDVComponent implements OnInit {

   //variavel input insere item
   @ViewChild('inputSearch') inputSearch: ElementRef;

   //variaveis de modais
   @ViewChild('modalClienteManual') modalClienteManual: ElementRef;
   cliente_manual_modal: any = null;
   @ViewChild('modalListVendas') modalListVendas: ElementRef;
   vendas_list_modal: any = null;
   @ViewChild('modalListProdutos') modalListProdutos: ElementRef;
   produtos_list_modal: any = null;
   @ViewChild('modalEndVenda') modalEndVenda: ElementRef;
   end_venda_modal: any = null;
   @ViewChild('modalOptions') modalOptions: ElementRef;
   options_modal: any = null;
   @ViewChild('modalConfigPDV') modalConfigPDV: ElementRef;
   configPDVModal: any = null;

   // tamanho da tela
   screenHeight: number = window.innerHeight;

   usuario = { 'id': 1, 'login': 'Francisco Alex' };

   //formato da venda
   venda = { 'id_venda': '', 'status': '0', 'cliente': '', 'subtotal': 0, 'desc': 0, 'vdesc': 0, 'total': 0, 'obs': '' };

   //configurações do PDV
   configPDV = {
      local: { 'printPD': '', 'printSD': '' },
      remoto: { 'maxDesconto': 10, 'cancela_venda': 0 }
   };

   //lista de vendas
   vendasList = [];

   //filtros de vendas
   filtros = { 'cliente': '', 'status': 1, 'data': '' };

   //dados do cliente
   clienteCurrent = { 'cliente': '' };

   //array de Produtos filtrados
   produtos_list = [];

   //array de Produtos mais vendidos
   produtos_best_sales = [];

   //filtros na busca de produtos
   filtros_produtos: any = { 'termo': '', 'tipo': '' };

   //array de itens do pedido
   itens = [];

   //variavel que recebe os termos da pesquisa de produtos
   searchProdutos = '';
   //variavel que recebe valor do pagamento
   selectPayments = '';

   //variavel que recebe o troco
   troco_valor = 0;

   //array Formas de Pagamentos
   paymentsList = [
      { 'id_pay': 1, 'descricao': '1 - Dinheiro', 'valor': 0.00 },
      { 'id_pay': 2, 'descricao': '2 - Cartão de Crédito', 'valor': 0.00 },
      { 'id_pay': 3, 'descricao': '3 - Cartão de Débito', 'valor': 0.00 }
   ];

   //array de pagamentos selecionados
   paymentsCurrent = [];

   QZsocket: any = false;

   //lista impressoras instaladas
   listPrints = [];

   constructor(private model: ModelService, private modalService: NgbModal, private message: MessagesService, private zone: NgZone) {
      this.produtos_best_list();
   }

   ngOnInit(): void {
      // this.qzInit();
   }

   //reseta a tudo
   restart() {

      //formato da venda
      this.venda = { 'id_venda': '', 'status': '0', 'cliente': '', 'subtotal': 0, 'desc': 0, 'vdesc': 0, 'total': 0, 'obs': '' };

      //lista de vendas
      this.vendasList = [];

      //filtros de vendas
      this.filtros = { 'cliente': '', 'status': 1, 'data': '' };

      //dados do cliente
      this.clienteCurrent = { 'cliente': '' };

      //array de Produtos filtrados
      this.produtos_list = [];

      //busca Produtos mais vendidos
      this.produtos_best_list()

      //filtros na busca de produtos
      this.filtros_produtos = { 'termo': '', 'tipo': '' };

      //array de itens do pedido
      this.itens = [];

      //variavel que recebe os termos da pesquisa de produtos
      this.searchProdutos = '';
      //variavel que recebe valor do pagamento
      this.selectPayments = '';

      //variavel que recebe o troco
      this.troco_valor = 0;

      //array de pagamentos selecionados
      this.paymentsCurrent = [];

   }
   qzInit() {
      qz.api.setSha256Type(data => sha256(data));
      qz.api.setPromiseType(resolver => new Promise(resolver));
      qz.security.setCertificatePromise((resolve, reject) => {
         this.model.http.get('https://hpistore.com.br/qz_assign/digital-certificate.php').subscribe(data => {
            // console.log(data);
            resolve(data);
         })
      });
      qz.security.setSignaturePromise((toSign) => {
         return (resolve, reject) => {
            this.model.http.get('https://hpistore.com.br/qz_assign/sign-message.php?request=' + toSign).subscribe(data => {
               // console.log(data);
               resolve(data);
            });
            // $.ajax("./qz_assign/sign-message.php?request=" + toSign).then(resolve, reject);
         };
      });

      this.QZsocket = 'load';
      this.message.loadingInit('Carregando plugin QZ...');
      qz.websocket.connect().then(() => {
         console.log('conectado!');
         this.zone.run(() => {
            this.QZsocket = '1';
         });
         this.message.loadingDiss();
      }).catch(error => {
         this.message.alertErro('Não foi possível uma conexão com o plugin QZ!', 'Falha Plugin');
         this.QZsocket = '0';
         this.message.loadingDiss();
      });
   }

   //select produtos mais vendidos
   produtos_best_list() {
      // this.message.loadingInit();
      this.model.http.post(this.model.baseURL + 'produtos-best_sales.php', {}).subscribe((data: any) => {
         // this.message.loadingDiss();
         this.produtos_best_sales = data;
      }, erro => {
         // this.message.loadingDiss();
         this.message.alertErro(erro.error.text, 'Ops!');
      });
   }

   //Geração de venda  =================================================
   gera_venda() {
      if (this.venda.id_venda != '') {
         this.message.alertErro('Venda Aberta!', 'Ops!');
         return false;
      }

      this.message.loadingInit();
      this.model.http.post(this.model.baseURL + 'venda-new.php', { 'usuario': this.usuario }).subscribe((data: any) => {
         this.message.loadingDiss();
         this.get_venda(data.id_venda);
      }, erro => {
         this.message.loadingDiss();
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      });
   }

   // recupera dados da venda
   get_venda(id_venda) {

      this.message.loadingInit();
      this.model.http.post(this.model.baseURL + 'venda-push.php', id_venda).subscribe((data: any) => {
         this.message.loadingDiss();

         this.venda = data.venda;
         this.itens = data.itens;
         this.paymentsCurrent = data.payments;

         if (data.venda.status != 1) {
            this.end_venda_options();
            // this.message.alert('Venda já foi finalizada!', 'Ops!');
            // return false;
         }//alerta de verificação

         if (this.vendas_list_modal != null) { this.vendas_list_modal.close() };//fecha modal se tiver aberto!

      }, erro => {
         this.message.loadingDiss();
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      });

   }

   //particiona quantidade e código
   search_item() {

      if (this.venda.id_venda == null || this.venda.id_venda == '') {
         this.message.alertErro('Venda não iniciada!', 'Ops!');
         return false;
      }


      const str: string = this.inputSearch.nativeElement.value;
      const position = str.indexOf('*');
      let codigo: any;
      let qtde: any;

      if (position < 0) {
         codigo = str;
         qtde = 1;
      } else {
         qtde = str.substr(0, position);
         codigo = str.substr(position + 1);
      }

      this.search_item_d(codigo, qtde);

   }
   //faz a inserção do item
   search_item_d(codigo, qtde) {
      if (this.venda.id_venda == null || this.venda.id_venda == '') {
         this.message.alertErro('Venda não iniciada!', 'Ops!');
         return false;
      }

      const request = { 'id_venda': this.venda.id_venda, 'codigo': codigo, 'qtde': qtde };

      this.message.loadingInit();
      this.model.http.post(this.model.baseURL + 'produto-search.php', request).subscribe((data: any) => {
         this.message.loadingDiss();
         this.inputSearch.nativeElement.value = '';
         this.get_venda(this.venda.id_venda);
         if (this.produtos_list_modal != null) { this.produtos_list_modal.close() };
      }, erro => {
         this.message.loadingDiss();
         this.searchProdutos = codigo;
         if (this.produtos_list_modal == null) { this.list_produtos() };
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      });
   }
   //open modal list produtos
   list_produtos() {
      this.produtos_list_modal = this.modalService.open(this.modalListProdutos, {
         size: 'lg',
         backdrop: 'static',
      });
      this.search_produtos();
   }
   //pesquisa produtos
   search_produtos() {

      if (this.searchProdutos.length < 4) {
         return false;
      }

      this.model.http.post(this.model.baseURL + 'produtos-list.php', { termo: this.searchProdutos }).subscribe((data: any) => {
         this.produtos_list = data;
      }, erro => {
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      });
   }
   select_produto(item) {
      if (this.venda.id_venda == null || this.venda.id_venda == '') {
         this.message.alertErro('Venda não iniciada!', 'Ops!');
         return false;
      }
      this.message.swal.fire({
         title: item.descricao,
         input: 'number',
         inputAttributes: {
            autocapitalize: 'off',
            'placeholder': 'Informe a quantidade...'
         },
         showCancelButton: true,
         cancelButtonText: 'Voltar',
         confirmButtonText: 'Confirmar',
         showLoaderOnConfirm: true,
         customClass: { popup: 'swal2-sm' }
      }).then((result) => {
         console.log(result);
         if (result.value != '' && result.value > 0) {
            this.search_item_d(item.id_produto, result.value);
         }
      })
   }

   //lista modal de vendas
   list_vendas() {

      this.message.loadingInit();
      this.model.http.post(this.model.baseURL + 'vendas-list.php', this.filtros).subscribe((data: any) => {
         this.message.loadingDiss();

         this.vendasList = data;
         this.vendas_list_modal = this.modalService.open(this.modalListVendas, {
            size: 'lg',
            backdrop: 'static',
         });
      }, erro => {
         this.message.loadingDiss();
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      });
   }
   //filtra as vendas
   search_vendas() {
      this.model.http.post(this.model.baseURL + 'vendas-list.php', this.filtros).subscribe((data: any) => {
         this.vendasList = data;
      }, erro => {
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      });
   }

   manual_cliente() {
      this.cliente_manual_modal = this.modalService.open(this.modalClienteManual, {
         size: 'sm',
         backdrop: 'static',
      });
   }
   set_cliente(tipo, cliente: any = {}) {

      if (this.venda.id_venda == null || this.venda.id_venda == '') {
         this.message.alertErro('Venda não iniciada!', 'Ops!');
         return false;
      }

      let request;
      if (tipo == 0) {
         request = { 'id_venda': this.venda.id_venda, 'cliente': this.clienteCurrent.cliente };
      } else {
         request = { 'id_venda': this.venda.id_venda, 'cliente': cliente.cliente };
      }

      this.message.loadingInit();
      this.model.http.post(this.model.baseURL + 'cliente-save.php', request).subscribe((data: any) => {
         this.message.loadingDiss();
         this.get_venda(this.venda.id_venda);
         if (this.cliente_manual_modal != null) { this.cliente_manual_modal.close(); }
      }, erro => {
         this.message.loadingDiss();
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      })
   }

   //Cancelamento  =================================================
   cancel_item() {
      if (this.venda.id_venda == null || this.venda.id_venda == '') {
         this.message.alertErro('Venda não iniciada!', 'Ops!');
         return false;
      }

      this.message.swal.fire({
         title: 'Cancelamento de Item',
         input: 'text',
         inputAttributes: {
            autocapitalize: 'off',
            'placeholder': 'Digite o número do item...'
         },
         showCancelButton: true,
         cancelButtonText: 'Voltar',
         confirmButtonText: 'Confirmar',
         showLoaderOnConfirm: true,
         customClass: { popup: 'swal2-sm' }
      }).then((result) => {
         console.log(result);
         if (result.value && result.value != '') {
            const indice = parseFloat(result.value) - 1;
            const item = this.itens[indice];
            this.cancela_item(item);
         }
      })
   }
   cancela_item(item) {
      this.message.loadingInit();
      this.model.http.post(this.model.baseURL + 'item-remove.php', item).subscribe(() => {
         this.message.loadingDiss();
         this.get_venda(this.venda.id_venda);
      }, erro => {
         this.message.loadingDiss();
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      })
   }
   cancel_venda() {
      if (this.venda.id_venda == null || this.venda.id_venda == '') {
         this.message.alertErro('Venda não iniciada!', 'Ops!');
         return false;
      }

      this.message.swal.fire({
         title: 'Cancelar Venda ?',
         icon: 'question',
         showCancelButton: true,
         cancelButtonText: 'Voltar',
         confirmButtonText: 'Confirmar',
         showLoaderOnConfirm: true,
         customClass: { popup: 'swal2-sm' }
      }).then((result) => {
         console.log(result);
         if (result.value) {
            this.cancela_venda();
         }
      })
   }
   cancela_venda() {

      this.message.loadingInit();
      this.model.http.post(this.model.baseURL + 'venda-cancelar.php', this.venda).subscribe(() => {
         this.message.loadingDiss();

         //restart Venda
         this.restart();

      }, erro => {
         this.message.loadingDiss();
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      });

   }

   //Finalizações =================================================
   end_modal_venda() {

      if (this.venda.id_venda == null || this.venda.id_venda == '') {
         this.message.alertErro('Venda não iniciada!', 'Ops!');
         return false;
      }

      this.gera_desc();

      this.end_venda_modal = this.modalService.open(this.modalEndVenda, {
         size: 'md',
         backdrop: 'static',
      });
   }
   gera_vdesc() {
      const subtotal = this.venda.subtotal;
      const desc = (isNaN(this.venda.desc)) ? 0 : this.venda.desc;

      const vdesc = (desc / 100) * subtotal;

      // this.verifica_desconto(desc, vdesc, subtotal);
      this.venda.desc = desc;
      this.venda.vdesc = vdesc;
      this.venda.total = subtotal - vdesc;
   }
   gera_desc() {
      const subtotal = this.venda.subtotal;
      const vdesc = this.venda.vdesc;

      const desc = (vdesc / subtotal) * 100;
      // this.verifica_desconto(desc, vdesc, subtotal);
      this.venda.desc = desc;
      this.venda.vdesc = vdesc;
      this.venda.total = subtotal - vdesc;
   }
   end_venda() {

      if (this.paymentsCurrent.length <= 0) {
         this.message.alertErro('Você não informou nenhum pagamento!', 'Ops!');
         return false;
      }

      let pago = 0;
      for (let i = 0; i < this.paymentsCurrent.length; i++) {
         console.log(this.paymentsCurrent[i]);
         //soma o total de pagamentos
         pago += (isNaN(this.paymentsCurrent[i].valor)) ? 0 : this.paymentsCurrent[i].valor;

      }

      let total = parseFloat(this.venda.total.toFixed(2));

      if (pago < total) {
         this.message.alertErro('Total pago não é suficiente!', 'Ops!');
         return false;
      }

      let request = {
         'venda': this.venda,
         'paymentsCurrent': this.paymentsCurrent,
      }

      this.message.loadingInit('Finalizando venda...');
      this.model.http.post(this.model.baseURL + 'venda-finalizar.php', request).subscribe((data) => {
         this.message.loadingDiss();
         this.end_venda_modal.close();
         this.end_venda_options();
      }, erro => {
         this.message.loadingDiss();
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      });

   }

   //Pagamentos =================================================
   change_payment(ev) {
      const id_pay = ev.target.value;

      for (let i = 0; i < this.paymentsCurrent.length; i++) {
         // console.log(this.paymentsCurrent);
         if (this.paymentsCurrent[i].id_pay == id_pay) {
            this.message.alert('Pagamento já informado!', 'Ops!');
            return false;
         }
      }

      if (id_pay == 1) { //for dinheiro
         this.addPayment({ 'id_pay': 1, 'descricao': 'Dinheiro', 'valor': '' });
      } else if (id_pay == 2) {// for
         this.addPayment({ 'id_pay': 2, 'descricao': 'Cartão de Crédito', 'valor': '' });
      } else if (id_pay == 3) {// for
         this.addPayment({ 'id_pay': 3, 'descricao': 'Cartão de Débito', 'valor': '' });
      }

   }
   addPayment(item) {
      this.message.swal.fire({
         title: item.descricao,
         input: 'number',
         inputAttributes: {
            autocapitalize: 'off',
            'placeholder': 'Informe o valor pago...',
            'step': 'any'
         },
         showCancelButton: true,
         cancelButtonText: 'Voltar',
         confirmButtonText: 'Confirmar',
         showLoaderOnConfirm: true,
         customClass: { popup: 'swal2-sm' }
      }).then((result) => {
         this.selectPayments = '';

         if (result.value && result.value != '') {
            item.valor = parseFloat(result.value);
            if (!this.payment_totais(item.valor) && (item.id_pay == 2 || item.id_pay == 3 || item.id_pay == 5)) {
               this.message.alertErro('Pagamento acima do total', 'Ops!');
               return false;
            }

            this.paymentsCurrent.push(item);
         }
      })
   }
   remove_payment(i) {
      this.paymentsCurrent.splice(i, 1);
   }
   payment_totais(valor) {
      let pago = 0;
      for (let i = 0; i < this.paymentsCurrent.length; i++) {
         pago += (isNaN(this.paymentsCurrent[i].valor)) ? 0 : this.paymentsCurrent[i].valor;
      }

      const pagar = Math.ceil(this.venda.total - pago);

      if (pagar < valor) {
         return false;
      } else {
         return true;
      }
   }

   end_venda_options() {

      let troco = 0;
      let total_venda = this.venda.total;
      this.paymentsCurrent.forEach(payment => {
         console.log(payment)
         if (payment.id_pay == 1 || payment.id_pay == 4) {//igual a cheque ou igual a dinheiro
            troco += payment.valor;
         } else {
            total_venda -= payment.valor;
         }
      });

      this.troco_valor = troco - total_venda;

      this.options_modal = this.modalService.open(this.modalOptions, {
         size: 'sm',
         backdrop: 'static',
         keyboard: false,
      });

   }
   //Printers =================================================
   print_cupom(id_venda) {
      console.log('print Cupom');

      if (!this.configPDV.local.printPD) {
         this.message.alertErro('Impressora padrão não configurada!');
         return false;
      }

      this.message.loadingInit();
      this.model.http.post(this.model.baseURL + 'print-cupom.php', { 'id_venda': id_venda }).subscribe((data: any) => {
         this.message.loadingDiss();
         // console.log(data);
         this.print_send(this.configPDV.local.printPD, data.print_data);
      }, erro => {
         this.message.loadingDiss();
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      });
   }
   print_send(printer, data) {
      let request = [{
         type: 'raw',
         format: 'base64',
         data: data
      }];
      qz.print(qz.configs.create(printer), request).catch((erro) => {
         console.log(erro);
         this.message.alertErro("Falha ao imprimir!");
      })
   }

   //configurações ================================================
   open_config() {

      qz.printers.find().then((data) => {
         console.log(data);
         this.listPrints = data;
      }).catch((e) => { console.error(e); });

      this.configPDVModal = this.modalService.open(this.modalConfigPDV, {
         size: 'md',
         backdrop: 'static',
      });
   }
   set_config() {
      localStorage.setItem('config_pdv', JSON.stringify(this.configPDV.local));
      this.configPDVModal.close();
   }
   print_teste(printer) {
      console.log('print Teste');
      this.model.http.post(this.model.baseURL + 'print-teste.php', {}).subscribe((data: any) => {
         // console.log(data);
         this.print_send(printer, data.print_data);
      }, erro => {
         this.message.alertErro(erro.error.text, 'Ops!');
         console.log(erro);
      });
   }

   //Uteis  =================================================
   current_data() {
      const data = new Date();
      console.log(data.getTimezoneOffset() / 60);

      let dia: any = data.getDate();
      dia = (dia < 10) ? '0' + dia : dia;

      let mes: any = data.getMonth() + 1;
      mes = (mes < 10) ? '0' + mes : mes;

      const ano = data.getFullYear();

      return ano + '-' + mes + '-' + dia;
   }

}
