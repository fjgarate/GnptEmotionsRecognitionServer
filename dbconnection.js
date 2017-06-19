/**
 * http://usejsdoc.org/
 */
var mysql=require('mysql');
 var connection=mysql.createPool({
 
host:'localhost',
 user:'gnpt',
 password:'gnpt',
 database:'mydb'
 
});
 module.exports=connection;