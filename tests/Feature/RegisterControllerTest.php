<?php

test('a user can register', function () {
    $response = $this->post('/register', [
        'name' => 'John Doe',
        'username' => '@johndoe',
        'email' => 'john@example.com',
        'password' => 'Password1',
    ]);

    $response->assertRedirect(route('home'));

    $this->assertAuthenticated();

    $this->assertDatabaseHas('users', [
        'name' => 'John Doe',
        'username' => 'johndoe',
        'email' => 'john@example.com',
    ]);
});
