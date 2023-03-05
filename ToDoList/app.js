
const form=document.querySelector("#todoAddForm");
const addInput=document.querySelector("#todoName");
const toDoList=document.querySelector(".list-group");
const firstCardBody=document.querySelectorAll(".card-body")[0];
const secondCardBody=document.querySelectorAll(".card-body")[1];
const filterInput=document.querySelector("#todoSearch");

let toDos=[];

runEvents();

function runEvents(){
    form.addEventListener("submit",addToDo);
    document.addEventListener("DOMContentLoaded", pageLoaded);
    toDoList.addEventListener("click",removeToDoFromUI);
    filterInput.addEventListener("keyup", searchFilter);
}

function pageLoaded(){
    checkToDosFromStorage();

    toDos.forEach(toDo => {
        addToDoUI(toDo);
    });
 }

function addToDo(e){

    const inputText= addInput.value.trim();
    if(inputText==null || inputText==""){
        showAlert("warning", "Lütfen görev giriniz!")
    }
    else{
        addToDoUI(inputText);
        addToDoToStorage(inputText);
        showAlert("success", "Görev başarıyla eklendi.")
    }
    e.preventDefault();
}

function addToDoUI(newToDo){

   const li= document.createElement("li");
   li.className="list-group-item d-flex justify-content-between";
   li.textContent=newToDo;

   const a=document.createElement("a");
   a.className="delete-item";
   a.href="#";

   const i=document.createElement("i");
   i.className="fa fa-remove";

   a.appendChild(i);
   li.appendChild(a);
   toDoList.appendChild(li);

   addInput.value="";
}

function addToDoToStorage(newToDo){
    checkToDosFromStorage();
    toDos.push(newToDo);
    localStorage.setItem("toDos", JSON.stringify(toDos));
}

function removeToDoFromUI(e){

    if(e.target.className==="fa fa-remove"){
        const toDo=e.target.parentElement.parentElement;
        toDo.remove();
        removeToDoFromStorage(toDo.textContent);
        showAlert("success", "Görev başarıyla silindi.")
    }
}

function removeToDoFromStorage(removetoDo){
    checkToDosFromStorage();

    toDos.forEach((toDo, index )=> {
        if(toDo===removetoDo)
        {
            toDos.splice(index,1);
        }
    });
    localStorage.setItem("toDos",JSON.stringify(toDos));
}

function checkToDosFromStorage(){
    if(localStorage.getItem("toDos")===null){
        toDos=[];
    }
    else{
        toDos=JSON.parse(localStorage.getItem("toDos"));
    }
}

function showAlert(type, msg){
    const div=document.createElement("div");
    div.className=`alert alert-${type} mt-3`;
    div.role="alert";
    div.textContent=msg;
    firstCardBody.appendChild(div);

    setTimeout(() => {
        div.remove();
    }, 3000);
}

function clearAllTodo(listToDo){
 
    listToDo.forEach(element => {
        element.remove();
    });

    toDos=[];
    localStorage.setItem("toDos",JSON.stringify(toDos));

    showAlert("success", "Bütün görevler başarılı bir şekilde silindi.")      
}

function searchFilter(e){
    const filter=e.target.value.toLowerCase().trim();
    const li=document.querySelectorAll(".list-group-item");
    var txtValue;

    if(li.length>0){
        for (i = 0; i < li.length; i++) {
            txtValue= li[i].textContent || li[i].innerText;
            if (txtValue.toLowerCase().trim().indexOf(filter) > -1) {
                li[i].setAttribute("style", "display: block");
            } else {
                li[i].setAttribute("style", "display: none !important");
            }
        }
    }else{
        showAlert("warning","Arama yapabilmek için en az bir görev olmalıdır.");
    }   
}

function confirmToClear(){
    
    const listToDo=document.querySelectorAll(".list-group-item");
    if(listToDo.length>0){

        let text = "Bütün görevleri silmek istediğinizden emin misiniz?";
        if (confirm(text) == true) {
            clearAllTodo(listToDo);
        }
        else {
            showAlert("info", "Silme işlemi iptal edildi.")
        }
    }
    else{
        showAlert("warning", "Silmek için en az bir görev olmalıdır.")
    }
}