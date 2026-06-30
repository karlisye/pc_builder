<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  private array $tables = [
    'cpus', 'motherboards', 'rams', 'gpus', 'ssds',
    'hdds', 'cases', 'fans', 'psus', 'coolers',
  ];

  public function up(): void
  {
    foreach ($this->tables as $table) {
      Schema::table($table, function (Blueprint $table_) {
        $table_->string('ean')->nullable()->index()->after('product_code');
        $table_->string('brand')->nullable()->after('ean');
        $table_->string('image_url', 1000)->nullable()->after('brand');
      });
    }

    Schema::table('cpus', function (Blueprint $table) {
      $table->string('memory_type')->nullable()->index();
      $table->decimal('pcie_version', 3, 1)->nullable();
    });

    Schema::table('motherboards', function (Blueprint $table) {
      $table->smallInteger('max_memory_capacity')->nullable();
    });

    Schema::table('rams', function (Blueprint $table) {
      $table->string('voltage')->nullable();
      $table->boolean('xmp')->nullable();
    });

    Schema::table('gpus', function (Blueprint $table) {
      $table->string('vram_type')->nullable();
      $table->string('gpu_family')->nullable();
    });

    Schema::table('ssds', function (Blueprint $table) {
      $table->string('nand_type')->nullable();
      $table->smallInteger('tbw')->nullable();
      $table->integer('random_read_iops')->nullable();
      $table->integer('random_write_iops')->nullable();
    });

    Schema::table('hdds', function (Blueprint $table) {
      $table->string('form_factor')->nullable()->index();
      $table->integer('rpm')->nullable();
      $table->smallInteger('cache_mb')->nullable();
    });

    Schema::table('cases', function (Blueprint $table) {
      $table->boolean('psu_included')->nullable();
      $table->tinyInteger('fans_included')->nullable();
      $table->string('radiator_support')->nullable();
      $table->smallInteger('max_psu_length')->nullable();
    });

    Schema::table('fans', function (Blueprint $table) {
      $table->string('rgb_type')->nullable();
      $table->string('led_color')->nullable();
      $table->decimal('noise_max_db', 4, 1)->nullable();
      $table->smallInteger('rpm_min')->nullable();
    });

    Schema::table('psus', function (Blueprint $table) {
      $table->decimal('amps_12v', 5, 1)->nullable();
      $table->boolean('pcie_5')->nullable();
      $table->string('cpu_connectors')->nullable();

      // doctrine/dbal is not installed, so column type changes must be
      // done via dropColumn + re-addColumn rather than ->change()
      $table->dropColumn('modular');
      $table->dropColumn('pcie_connectors');
    });

    Schema::table('psus', function (Blueprint $table) {
      $table->string('modular')->nullable();
      $table->string('pcie_connectors')->nullable();
    });

    Schema::table('coolers', function (Blueprint $table) {
      $table->tinyInteger('fan_count')->nullable();
      $table->smallInteger('rpm_max')->nullable();
      $table->smallInteger('rpm_min')->nullable();
      $table->string('connector')->nullable();
    });
  }

  public function down(): void
  {
    foreach ($this->tables as $table) {
      Schema::table($table, function (Blueprint $table_) {
        $table_->dropColumn(['ean', 'brand', 'image_url']);
      });
    }

    Schema::table('cpus', function (Blueprint $table) {
      $table->dropColumn(['memory_type', 'pcie_version']);
    });

    Schema::table('motherboards', function (Blueprint $table) {
      $table->dropColumn('max_memory_capacity');
    });

    Schema::table('rams', function (Blueprint $table) {
      $table->dropColumn(['voltage', 'xmp']);
    });

    Schema::table('gpus', function (Blueprint $table) {
      $table->dropColumn(['vram_type', 'gpu_family']);
    });

    Schema::table('ssds', function (Blueprint $table) {
      $table->dropColumn(['nand_type', 'tbw', 'random_read_iops', 'random_write_iops']);
    });

    Schema::table('hdds', function (Blueprint $table) {
      $table->dropColumn(['form_factor', 'rpm', 'cache_mb']);
    });

    Schema::table('cases', function (Blueprint $table) {
      $table->dropColumn(['psu_included', 'fans_included', 'radiator_support', 'max_psu_length']);
    });

    Schema::table('fans', function (Blueprint $table) {
      $table->dropColumn(['rgb_type', 'led_color', 'noise_max_db', 'rpm_min']);
    });

    Schema::table('psus', function (Blueprint $table) {
      $table->dropColumn(['amps_12v', 'pcie_5', 'cpu_connectors']);
      $table->dropColumn('modular');
      $table->dropColumn('pcie_connectors');
    });

    Schema::table('psus', function (Blueprint $table) {
      $table->boolean('modular')->default(false)->index();
      $table->tinyInteger('pcie_connectors')->nullable()->index();
    });

    Schema::table('coolers', function (Blueprint $table) {
      $table->dropColumn(['fan_count', 'rpm_max', 'rpm_min', 'connector']);
    });
  }
};
