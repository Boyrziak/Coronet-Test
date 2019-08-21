angular.module('userList').component('userList', {
    templateUrl: 'user-list/user-list.template.html',
    controller: ['$http', '$scope', function UserListController($http, $scope) {
        let self = this;
        self.users = [{}];
        // updateUsers();

        let socket = io('http://localhost:3000');
        socket.emit('update');
        socket.on('update', function (users) {
            updateUsers(users);
        });

        function updateUsers(users) {
            // $http.get('http://localhost:1603/getUsers').then((response) => {
            //     // self.users = response.data;
            //     console.log(response.data);
            // });
            self.users = users;
            $scope.users = users;
            $scope.$apply();
        }

        this.deleteUser = function deleteUser(userId) {
            $http.get('http://localhost:1603/deleteUser?id=' + userId).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    // updateUsers();
                    socket.emit('update');
                }
            });
        };
    }]
});

