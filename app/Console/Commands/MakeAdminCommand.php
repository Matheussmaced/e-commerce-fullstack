<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class MakeAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:admin {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Promote a user to administrator role by their email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("Usuário com o e-mail '{$email}' não encontrado.");
            return 1;
        }

        if ($user->role === 'admin') {
            $this->info("O usuário '{$email}' já é um administrador.");
            return 0;
        }

        $user->role = 'admin';
        $user->save();

        $this->info("Usuário '{$email}' promovido a administrador com sucesso!");
        return 0;
    }
}
