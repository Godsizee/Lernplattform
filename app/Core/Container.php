<?php
namespace App\Core;

class Container {
    protected $services = [];

    public function set($name, $service) {
        $this->services[$name] = $service;
    }

    public function get($name) {
        if (!isset($this->services[$name])) {
            throw new \Exception("Service '{$name}' nicht im Container gefunden.");
        }
        return $this->services[$name];
    }
}
