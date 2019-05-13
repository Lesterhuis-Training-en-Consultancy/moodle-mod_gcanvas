<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Plugin EN strings are defined here.
 *
 * @package     mod_gcanvas
 * @copyright   2018 Luuk Verhoeven - LdesignMedia.nl / MFreak.nl <luuk@ldesignmedia.nl>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();
// Init.
$string['pluginname'] = 'Canvas spel';
$string['modulename'] = 'Canvas spel';
$string['modulename_help'] = 'Het doel van het Canvas spel is dat leerlingen op een vrije manier meer inzicht kunnen krijgen in hun eigen situatie. Dit kan met behulp van tekst, afbeeldingen of vormen. Elke canvas kan vervolgens opgeslagen, gedownload of hergebruikt worden. Het canvas spel heeft geen beoordelingsmethode.';

$string['modulenameplural'] = 'Canvas spel';
$string['pluginadministration'] = 'Canvas spel instellingen';
$string['teacher_tools'] = 'Docent opties';

$string['gcanvas:addinstance'] = 'Voeg een nieuwe canavas spel activiteit toe';
$string['gcanvas:view'] = 'Bekijk canvas spel';
$string['gcanvas:teacher'] = 'De canvas docent kan de canvas instellingen wijzigen.';
$string['gcanvas:student_image'] = 'Sta leerlingen toe om bestanden te uploaden.';

// Form.
$string['form:gcanvasname'] = 'Canvas naam';
$string['form:has_horizontal_ruler'] = 'Toon horizontale balk.';
$string['form:has_horizontal_ruler_desc'] = 'Voeg een horizontale balk toe aan het canvas, de balk kan verschoven worden met behulp van de pijltjes op je toetsenbord.';
$string['form:attachment'] = 'Bijlage';
$string['form:helptext'] = 'Help tekt';

// Buttons.
$string['btn:save'] = 'Bewaar canvas';
$string['btn:clear'] = 'Wis alles';
$string['btn:samples'] = 'Toon voorbeeld';
$string['btn:text'] = 'Klik hier om tekst te plaatsen.';
$string['btn:image'] = 'Voeg je eigen afbeelding toe aan het canvas.';
$string['btn:trash'] = 'Selecteer de items die verwijderd worden van het canvas.';
$string['btn:arrow'] = 'Klik hier om een pijl te plaatsen.';
$string['btn:circle'] = 'Klik hier om een cirkel te plaatsen.';
$string['btn:rect'] = 'Klik hier om een rechthoek te plaatsen.';
$string['btn:triangle'] = 'Klik hier om een driehoek te plaatsen.';
$string['btn:smiley'] = 'Klik hier om een smiley te plaatsen.';
$string['btn:select_a_image'] = 'Klik hier om een afbeelding te plaatsen.';
$string['btn:remove'] = 'Verwijder je tekening.';
$string['btn:restore'] = 'Herstel je tekening.';
$string['btn:download'] = 'Download je tekening.';
$string['btn:save_file'] = 'Uploaden';
$string['btn:background'] = 'Achtergrond';
$string['btn:toolbar_images'] = 'Werkbalk afbeeldingen';
$string['btn:help'] = 'Help';
$string['btn:intro'] = 'Pas help tekst aan';
$string['btn:submit'] = 'Bewaren';
$string['btn:undo'] = 'Ongedaan maken';
$string['btn:colorpicker'] = 'Kleur selecteren';

// Javascript.
$string['javascript:confirm_title'] = 'Bevestig dat je deze tekening wil verwijderen.';
$string['javascript:confirm_desc'] = 'Weet je zeker dat je tekening wil verwijderen?';
$string['javascript:yes'] = 'Ja';
$string['javascript:no'] = 'Nee';
$string['javascript:updated'] = 'Bewaard!';

$string['privacy:metadata:attempt'] = 'Informatie het aantal keren dat een gebruiker het canvas spel gebruikt heeft.';
$string['privacy:metadata:attempt:gcanvas'] = 'Het canavs spel ID';
$string['privacy:metadata:attempt:json_data'] = 'Het aantal pogingen, is bewaard in json format.';
$string['privacy:metadata:attempt:added_on'] = 'De tijdstempel geeft aan wanneer een poging is bewaard.';