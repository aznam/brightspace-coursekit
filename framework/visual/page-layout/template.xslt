<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    <xsl:template match="/">
        <div class="ck-layout">
            <div class="ck-layout__header">
                <ck-children/>
            </div>
            <div class="ck-layout__grid">
                
                <ck-slot name="sidebar-before"/>
                
                <main class="ck-layout__main">
                    <div class="ck-layout__summary"><ck-slot name="summary-box"/></div>
                    <div class="ck-layout__content"><ck-slot name="central-content"/></div>
                </main>
                
                <ck-slot name="sidebar-after"/>
                
            </div>
        </div>
    </xsl:template>
</xsl:stylesheet>
