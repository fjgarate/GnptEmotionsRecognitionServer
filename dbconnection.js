/**
 * http://usejsdoc.org/
 */
var mysql=require('mysql');
 var connection=mysql.createPool({
 
host:'localhost',
 user:'gnpt',
 password:'gnpt',
 database:'gnpt_results'
 
});
 module.exports=connection;