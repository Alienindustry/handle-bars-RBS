{{! - - for each loop - - }}
{{#if contactsExist}}
{[#each contacts]}

<div class="col s12 m6">
   <div class="card blue-grey darken-1">
     <div class="card-content white-text">
        <span class="card-title">{{this.name}}</span>
   <p>{{this.email}}</p>
   <p>{{this.number}}</p>
    </div
   </div>
</div>
{{/each}}
{{else}}
<h1> you have no contacts</h1>