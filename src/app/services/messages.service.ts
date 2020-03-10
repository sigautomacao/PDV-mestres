import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
   providedIn: 'root'
})
export class MessagesService {
   public swal = Swal;

   constructor() { }


   alert(msg = '', titulo = '') {
      Swal.fire({
         icon: 'info',
         title: titulo,
         text: msg,
         allowOutsideClick: false,
         // position: 'top',
         customClass: { popup: 'swal2-sm' }
      });
   }

   alertErro(msg = '', titulo = 'Erro!') {
      Swal.fire({
         icon: 'error',
         title: titulo,
         text: msg,
         allowOutsideClick: false,
         // position: 'top',
         customClass: { popup: 'swal2-sm' }
      });
   }

   loadingInit(texto = '', size = 'md') {
      let loading = document.getElementById('loading');
      loading.style.display = 'flex';
      loading.innerHTML = ' <div class="loading-body loading-'+size+'"><div class="lds-dual-ring"></div><span>'+texto+'</span></div>';
   }

   loadingDiss() {
      let loading = document.getElementById('loading');
      loading.style.display = 'none';
      loading.innerHTML = '';
   }
}
