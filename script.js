let commentList= [
    // {
    //     likes: 0,
    //     date:new Date().toISOString(),
    //     comment:'Hey bro looking good',
    //     children:[]
    
    // },
    // {
    //     likes: 2,
    //     date:new Date().toISOString()+1,
    //     comment:'Yeah you look great',
    //     children:[]
    
    // }
    // ,
    // {
    //     likes: 1,
    //     date:new Date().toISOString()+2,
    //     comment:'100 UPP',
    //     children:[{
    //         likes: 0,
    //         date:new Date().toISOString()+3,
    //         comment:'Hey bro looking good',
    //         children:[{
    //             likes: 0,
    //             date:new Date().toISOString()+4,
    //             comment:'Hey ssasdsd looking good',
    //             children:[]
            
    //         },
    //         {
    //             likes: 2,
    //             date:new Date().toISOString()+5,
    //             comment:'Yeah you look great',
    //             children:[]
            
    //         }]
        
    //     },
    //     {
    //         likes: 2,
    //         date:new Date().toISOString()+6,
    //         comment:'Yeah you look great',
    //         children:[]      
    //     }]
    
    // }
];
let commentInput = document.getElementById('commentInput');
/*commentList =[{
    likes: 0
    date:Date()
    comment:'',
    children:[{}]

},{}]

*/
let f;
let child
let commentDOM = document.getElementById('commentList')


function addComment(){
    if(commentInput.value === '' || commentInput.value === null){
        alert('Please enter a comment to post')
        return;
    }
    let comment = {
        likes: 0,
        date:new Date().toISOString(),
        comment: commentInput.value,
        children:[]
    }
    commentList.push(comment)
    commentInput.value = ''
    Storage.setComments()
    if(commentDOM.children.length > 0){
        let x=`<li data-id=${comment.date}>
                    <span>${comment.comment}</span>
                    <button  onclick="editComment(event)">Edit</button> <button onclick="deleteComment(event)">Delete</button> <button onclick="replyComment(event)">Reply</button>
                </li>`
        commentDOM.children[0].innerHTML+=x;
    }
    else{
        let x=`<ul>
            <li data-id=${comment.date}>
                <span>${comment.comment}</span>
                <button  onclick="editComment(event)">Edit</button> <button onclick="deleteComment(event)">Delete</button> <button onclick="replyComment(event)">Reply</button>
            </li>
        </ul>`
        commentDOM.innerHTML+=x;
    }
}

function editComment(event){
    f=false;
    let newComment = prompt('Enter new comment')
    event.target.parentElement.children[0].innerText = newComment
    commentList = editCommentListUpdate(commentList,event.target.parentElement.dataset.id,newComment)
    Storage.setComments();
    console.log("EDIT",event)
}

function editCommentListUpdate(list,date,newComment){
    if(f)
        return list;
    for(let i=0;i<list.length;i++){
        if(list[i].date === date){
         f=true;
         list[i].comment = newComment
         return list;  
        }
        if(list[i].children.length > 0){
            list[i].children=editCommentListUpdate(list[i].children,date,newComment);
        }
    }
    return list;
}

function deleteComment(event){
    console.log("DELETE",event)
    let elem=event.target.parentElement;
    f=false;
    commentList=removeItem(commentList,elem.dataset.id);
    Storage.setComments();
    elem.remove();
}

function removeItem(list,date){
    if(f)
        return list;
    for(let i=0;i<list.length;i++){
        if(list[i].date === date){
         f=true;
         list.splice(i,1); 
         return list;  
        }
        if(list[i].children.length > 0){
            list[i].children=removeItem(list[i].children,date);
        }
    }
    return list;
}

function addChildComment(list,comment,date){
    if(f){
        return list;
    }
    for(let i=0;i<list.length;i++){
        if(list[i].date===date){
            f=true;
            if(list[i].children.length > 0)
                child=true;
            list[i].children.push(comment);
            
        }
        else{
            if(list[i].children.length > 0)
                addChildComment(list[i].children,comment,date)
        }
    }
    return list;
}

function replyComment(event){
    let el=event.target.parentElement
    let commentInput = prompt('Enter reply')
    if(commentInput === '' || commentInput === null){
        alert('Please enter a reply to post')
        return;
    }
    let comment = {
        likes: 0,
        date:new Date().toISOString(),
        comment: commentInput,
        children:[]
    }
    f=false;
    child=false;
    commentInput.value = ''
    commentList=addChildComment(commentList,comment,el.dataset.id)
    Storage.setComments()
    if(child){
        let x=`<li data-id=${comment.date}>
                    <span>${comment.comment}</span>
                    <button  onclick="editComment(event)">Edit</button> <button onclick="deleteComment(event)">Delete</button> <button onclick="replyComment(event)">Reply</button>
                </li>`
        el.children[el.children.length-1].innerHTML+=x;
    }
    else{
        let x=`<ul>
            <li data-id=${comment.date}>
                <span>${comment.comment}</span>
                <button  onclick="editComment(event)">Edit</button> <button onclick="deleteComment(event)">Delete</button> <button onclick="replyComment(event)">Reply</button>
            </li>
        </ul>`
        el.innerHTML+=x;
    }
    console.log("REPLY",event)
}

function solveNesting(comment){
    if(comment.children.length === 0){
        return `<li data-id=${comment.date}>
            <span>${comment.comment}</span>
            <button  onclick="editComment(event)">Edit</button> <button onclick="deleteComment(event)">Delete</button> <button onclick="replyComment(event)">Reply</button>
        </li>`
    }   
    else{
        let result=`<li data-id=${comment.date}>
            <span>${comment.comment}</span>
            <button onclick="editComment(event)">Edit</button> <button onclick="deleteComment(event)">Delete</button> <button onclick="replyComment(event)">Reply</button>
            <ul>
        `;
        comment.children.forEach(child => {
            result+=solveNesting(child)
        })
        result+=`</ul>
        </li>`
        return result;
    }
}


// Local Storage

class Storage{
    static getComments(){
       return localStorage.getItem('commentList') ? JSON.parse(localStorage.getItem('commentList')) : []
    }
    static setComments(){
        localStorage.setItem('commentList',JSON.stringify(commentList))
    }
}


class UI{
    showComments(){
        let result='<ul>';
        commentList.forEach(comment => {
            result+=solveNesting(comment)
        })
        result+='</ul>'
        commentDOM.innerHTML = result;
    }
}


document.addEventListener('DOMContentLoaded',() => {
    commentList = Storage.getComments();
    const ui =new UI()
    ui.showComments();

})