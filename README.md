# sample select 

sample select  is a vanila javascript replacement for select boxes. It supports searching, remote data sets.
## Usage

i use sample javascript dom framework [edjs](https://github.com/ed3/edjs)
```native

$('#div').Selects({placeholder: 'Select an option'}) 

or  new 	Selects({option:document.querySelector('#div') });
```
## option 
```native
 issearch: true or false
 placeholder:'Select',
 searchplaceholder:'Search',
 odabrano:'Selected',
ajaxUrl:'some.php',
data:{q:"selected","op":"find"}} /// request will be silected=word in select&op=find
```
