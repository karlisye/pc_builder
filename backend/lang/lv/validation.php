<?php

return [

    'required' => 'Laukam :attribute jābūt aizpildītam.',
    'required_with' => 'Laukam :attribute jābūt aizpildītam, ja ir norādīts :values.',
    'string' => 'Laukam :attribute jābūt tekstam.',
    'email' => 'Laukam :attribute jābūt derīgai e-pasta adresei.',
    'unique' => 'Šāda :attribute vērtība jau tiek izmantota.',
    'confirmed' => 'Laukam :attribute apstiprinājums nesakrīt.',
    'min' => [
        'numeric' => 'Laukam :attribute jābūt vismaz :min.',
        'file' => 'Laukam :attribute jābūt vismaz :min kilobaitiem.',
        'string' => 'Laukam :attribute jābūt vismaz :min rakstzīmēm.',
        'array' => 'Laukam :attribute jābūt vismaz :min elementiem.',
    ],
    'max' => [
        'numeric' => 'Laukam :attribute nedrīkst pārsniegt :max.',
        'file' => 'Laukam :attribute nedrīkst pārsniegt :max kilobaitus.',
        'string' => 'Laukam :attribute nedrīkst pārsniegt :max rakstzīmes.',
        'array' => 'Laukam :attribute nedrīkst būt vairāk par :max elementiem.',
    ],
    'integer' => 'Laukam :attribute jābūt veselam skaitlim.',
    'array' => 'Laukam :attribute jābūt sarakstam.',
    'boolean' => 'Laukam :attribute jābūt patiesam vai aplamam.',
    'date' => 'Laukam :attribute jābūt derīgam datumam.',
    'after_or_equal' => 'Laukam :attribute jābūt datumam, kas ir vienāds ar :date vai vēlāks.',
    'in' => 'Atlasītā vērtība laukam :attribute nav derīga.',
    'exists' => 'Atlasītā vērtība laukam :attribute nav derīga.',
    'current_password' => 'Parole nav pareiza.',
    'mixed_case' => 'Laukam :attribute jāsatur gan lielie, gan mazie burti.',
    'letters' => 'Laukam :attribute jāsatur vismaz viens burts.',
    'numbers' => 'Laukam :attribute jāsatur vismaz viens cipars.',
    'symbols' => 'Laukam :attribute jāsatur vismaz viens simbols.',
    'uncompromised' => 'Norādītā :attribute vērtība ir atrasta datu noplūdē. Lūdzu, izvēlieties citu :attribute.',

    'attributes' => [
        'name' => 'vārds',
        'email' => 'e-pasts',
        'password' => 'parole',
        'new_password' => 'jaunā parole',
        'description' => 'apraksts',
        'notes' => 'piezīmes',
        'type' => 'tips',
        'components' => 'komponentes',
        'rating' => 'vērtējums',
    ],

];
