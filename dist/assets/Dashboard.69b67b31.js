import{a as i,p as n}from"./endpoint.aea53914.js";import{_ as c,u as d,d as a,f as t,t as s,F as u,r as _,o,a as m,w as p,e as g}from"./index.23a29a87.js";const h={data(){return{lecturers:null,store:d()}},beforeMount(){i.get(n+"lecturer",{params:{id:this.store.user.lecturerAccount.id}}).then(e=>this.lecturer=e.data),console.log(this.lecturer)}},f={class:"card bg-slate-100 divide-y divide-solid sm:ml-2 sm:mr-2 sm:p-4 p-1 mt-2 mb-10"},x=["src","alt"],y=t("div",{class:"card-actions justify-end"},[t("button",{class:"btn btn-primary"},"Edit Profile")],-1),b={class:"px-4 py-5 sm:px-6"},v={class:"text-xl font-bold leading-6 text-gray-900"},k={class:"text-xl font-bold leading-6 text-gray-900"},w={class:"bg-gray-50 py-5 grid grid-cols-2 gap-4 px-6"},B=t("p",{class:"text-lg font-medium"},"Bio",-1),$={class:"text-gray-900 mt-0 col-span-2"},A={class:"bg-gray-50 py-5 grid grid-cols-2 gap-4 px-6"},D=t("dt",{class:"text-lg font-medium"},"Daftar Bimbingan Tugas Akhir",-1),S={class:"text-gray-900 mt-0 col-span-2"},C={role:"list",class:"border border-gray-200 rounded-md divide-y divide-gray-200"},E={class:"w-0 flex-1 flex items-center"},F={class:"ml-2 flex-1 w-0 truncate text-black"},N={class:"ml-2 text-black"};function P(e,V,j,L,M,T){const l=g("router-link");return o(),a("div",f,[t("figure",null,[t("img",{src:e.lecturer.image,alt:e.lecturer.image,class:"h-96"},null,8,x)]),y,t("div",b,[t("h3",v,s(e.lecturer.name),1),t("h4",k,s(e.lecturer.nip),1)]),t("div",w,[B,t("p",$,s(e.lecturer.bio),1)]),t("div",A,[D,t("dd",S,[t("ul",C,[(o(!0),a(u,null,_(e.lecturer.project,r=>(o(),a("li",{class:"pl-3 pr-4 py-3 flex items-center justify-between",key:r},[t("div",E,[m(l,{to:{name:"Project",params:{title:r.title}}},{default:p(()=>[t("span",F,s(r.title),1),t("p",N,s(r.student.nrp)+" - "+s(r.student.name),1)]),_:2},1032,["to"])])]))),128))])])])])}const G=c(h,[["render",P]]);export{G as default};