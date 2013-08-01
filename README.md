hftp
====

a simple static http or ftp server

简易的http、ftp服务器

`npm install -g hftp` 安装（setup），使用到[nodejs](http://nodejs.org/)

`hftp [port] [tpye] [dir]`

 - 用法

  - `port` 指定服务的端口，默认值 `8888`
  - `type` 指定服务的类型（http、ftp），默认值 `ftp`
  - `dir` 指定服务的文件夹（绝对路径），默认值 当前目录

 - Usage

  - `port` service port, default `8888`
  - `type` service type (http、ftp), default `ftp`
  - `dir` service folder (Absolute path), default current dir


 - EXAMPLES

  - `hftp 8888 http d:\tt` 使用`http`服务，服务端口`8888`，工作目录`d:\tt`

  - `hftp 8888 http ` 默认使用当前目录

  - `hftp 8888`  默认使用当前目录、`ftp`服务

  - `hftp`  默认使用当前目录、`ftp`服务、`8888`端口
