# sample select 
>sample select  is a vanila javascript replacement for select boxes. It supports searching, remote data sets.
## Usage

>I use sample javascript dom framework [edjs](https://github.com/ed3/edjs)
```native

$('#select').Selects({placeholder: 'Select an option'}) 

or new Selects({option:document.querySelector('#select') });
```
## option 
```native
 option:'#select',
 issearch: true or false
 placeholder:'Select',
 searchplaceholder:'Search',
 odabrano:'Selected',
ajaxUrl:'some.php',
data:{q:"selected","op":"find"}} /// request will be silected=word in select&op=find
onSelect:function(value){}
```
