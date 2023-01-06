
'use strict';
var result;
const mainConatiner=document.getElementsByClassName('main');
const contextContainer=document.querySelector('.container');
const createBtn=document.querySelector('.create');
const hidden=document.querySelector('.hidden');
const savebtn=document.getElementById('save1');
const deletebtn=document.getElementsByClassName('delete');
const updatebtn=document.getElementsByClassName('update');
const searchButton = document.getElementById('search-button');
const sortAsc=document.getElementById('sorta');
const sortDes=document.getElementById('sortd');
//let mainblock=document.getElementById('blc');
//display data
function display(data)
{
  contextContainer.innerHTML='';
  for(let i=0;i<data.length;i++)
  {
  const html=`<div class="userdata" id="userdata-${i}" >
      <div class="data" id="name-${i}">name<br/>
      <div id="displayname-${i}">${data[i].name}</div>
      </div>
      <div class="data  username">username<br/>${data[i].username}</div>
      <div class="data email">email<br/>${data[i].email}</div>
        <input type="submit" class="update" id="update-${i}" key="${i}" value="update" >
        <input type="submit" class="savebtn" id="save-${i}" value="save">
        <input type="submit" value="delete" class='delete' data-key="${i}">
     </div>`
     contextContainer.insertAdjacentHTML('beforeend',html);
  }
  delete1();
  update1();
}
//create button
function create()
{
  createBtn.addEventListener('click',function(e)
  {
    e.preventDefault();
      hidden.style.opacity=1;
      createBtn.classList.add('hidden');
      document.getElementById('myform').reset();
      
  });
  //save or add data to local storage
  savebtn.addEventListener('click',function(e)
  {
    //getting data from form
    e.preventDefault();
    let name1 = document.forms[0].elements.name1.value;
    let email1 = document.getElementById("email1").value;
    let username1= document.getElementById("username1").value;
    let obj=
    {
      name:name1,
      username:username1,
      email:email1,
    }
//post  data into api
  fetch('https://jsonplaceholder.typicode.com/users', {
  method: 'POST',
  body: JSON.stringify(obj),
  headers: {
    'Content-Type': 'application/json'
  }
  }).then(res => res.json())
  .then(data =>{
    //push data into localstorage
    result=JSON.parse(localStorage.getItem('result1'));
    result.push(data);
    localStorage.setItem('result1',JSON.stringify(result));
       display(result);
       }); 
       createBtn.classList.remove('hidden');
    hidden.style.opacity=0;
  }); 
};
//update data
function update1()
{
  [...updatebtn].forEach(btn=>
    {
      btn.addEventListener('click',function(e){
        //form
        e.preventDefault();
        var key=btn.getAttribute("key");
       let nameUpdate=document.getElementById(`name-${key}`);
       //create form
       const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.name = 'name';
        //add form
        nameUpdate.appendChild(nameInput);
      //let nameDisplay=document.getElementById(`displayname-${key}`);
      //nameDisplay.style.opacity=0;
      btn.style.opacity=0;
      let savebtns=document.getElementById(`save-${key}`);
      savebtns.style.opacity=1;
      savebtns.addEventListener('click',function(e)
      {
        let updateName=nameInput.value;
        nameInput.style.opacity=0;
        btn.style.opacity=1;
        savebtns.style.opacity=0;
        //change in api
        if (updateName === "") return;
        fetch(`https://jsonplaceholder.typicode.com/users/${key}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: updateName,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json()).then((data)=>console.log(data));
        //CHANGE in local storage
        result=JSON.parse(localStorage.getItem('result1'));
        result[key].name=updateName;
        localStorage.setItem('result1',JSON.stringify(result))
        display(result);        
      });
      });
    });  
};
//delete data
function delete1(){
  [...deletebtn].forEach(ele=>{
    ele.addEventListener('click',function(e){
     //get the key
      var key=ele.getAttribute("data-key");
      //delete data from api
      fetch(`https://jsonplaceholder.typicode.com/users/${key}`, {
       method: 'DELETE'
          }).then(response => {
         if (response.ok) {
           console.log('Resource successfully deleted');
          } else {
           console.log('Unable to delete resource');
          }
         });
      //delete from local storage
      result=JSON.parse(localStorage.getItem('result1'));
      result.splice(key,1);
      localStorage.setItem('result1',JSON.stringify(result));
       display(result);
    });
  });
};
//search data
function search()
{
  searchButton.addEventListener('click',function(e)
  {
    let searchInput=document.getElementById('search-input');
    let searchValue=searchInput.value;
    //console.log(searchValue);
    e.preventDefault(); 
    result=JSON.parse(localStorage.getItem('result1'));
    let filterResult=result.filter(ele=>ele.name.includes(searchValue));
    //console.log(filterResult);
    display(filterResult);
    document.getElementById("search-input").value=""; 
  });
  
}
//sort data
function sort() 
{
  //sort in ascending order
  sortAsc.addEventListener('click',function(e)
  {
    result=JSON.parse(localStorage.getItem('result1'));
    result.sort(function(a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    //console.log(result);
    localStorage.setItem('result1',JSON.stringify(result))
    display(result);    
  });
  //sort in descending order
  sortDes.addEventListener('click',function(e)
  {
    result=JSON.parse(localStorage.getItem('result1'));
    result.sort(function(a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return 1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return -1;
      }
      return 0;
    });
    //console.log(result);
    localStorage.setItem('result1',JSON.stringify(result))
    display(result);    
  }); 
}
//fetching data
const fetchData=async function()
{
    const res=await fetch(`https://jsonplaceholder.typicode.com/users`);
  
     result =await res.json();
     console.log(result);
    //storing in local storage
    window.localStorage.setItem('result1',JSON.stringify(result));
    //display data
    result=JSON.parse(localStorage.getItem('result1'));
       display(result);
       sort();
       create(); 
       search();
          
};
//fetchData();
if(localStorage.getItem('result1'))
{
  result=JSON.parse(localStorage.getItem('result1'));
   display(result);
   sort();
   create(); 
   search();   
}
else
{
  fetchData();
}

function sort() 
{
  //sort in ascending order
  sortAsc.addEventListener('click',function(e)
  {
    result=JSON.parse(localStorage.getItem('result1'));
    result.sort(function(a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    //console.log(result);
    localStorage.setItem('result1',JSON.stringify(result))
    display(result);    
  });
  //sort in descending order
  sortDes.addEventListener('click',function(e)
  {
    result=JSON.parse(localStorage.getItem('result1'));
    result.sort(function(a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return 1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return -1;
      }
      return 0;
    });
    //console.log(result);
    localStorage.setItem('result1',JSON.stringify(result))
    display(result);    
  });
  
}







