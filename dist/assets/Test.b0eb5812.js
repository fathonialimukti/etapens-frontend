import{_ as s,d as r,o as l}from"./index.23a29a87.js";const c={data(){return{}},methods:{async getData(){this.$router.push({name:"Student Dashboard"})},async anal(a){const e=a.target.files;for(const t of e)t.path=t.webkitRelativePath.split("/"),t.path.shift(),t.path=t.path.join("/");try{console.log(e)}catch(t){console.log(t)}}}};function p(a,e,t,i,f,n){return l(),r("input",{type:"file",onChange:e[0]||(e[0]=(...o)=>n.anal&&n.anal(...o)),accept:".zip"},null,32)}const u=s(c,[["render",p]]);export{u as default};
